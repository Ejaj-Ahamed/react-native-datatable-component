import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import DataTableRow from './DataTableRow';
import PropTypes from 'prop-types';
import DataTableFooter from './DataTableFooter';
import DataTableHeader from './DataTableHeader';
import Line from './Line';
import sortData from '../functions/sort';
import showCurrentProgress from '../functions/showCurrentProgress';

export const COL_TYPES = {
    INT: 'INT',
    STRING: 'STRING',
    CHECK_BOX: 'CHECK_BOX'
}

const TOTAL_WIDTH = 100; //'100%'

class DataTable extends React.Component {
    state = {
        dataPropSnap: null,
        data: [], //[{...}, {...}, ....]
        displayData: [], //currentlyDisplayData
        colNames: [],//['ad', 'asd', ...]
        colNameSplitter: null,
        defaultEachColumnWidth: '50%',
        // noOfCols: 0, //default 2, set 0 because of fast rendering at start
        widthOfContainer: 0,
        isSortedAssending: { recentlySortedCol: null }, //ColName: true||false
        startDataArray: [],//[{id: startData}]
        endDataArray: [], //[{id, endData}]
        noOfPages: 3, //default
        activeDisplayDataId: 0,
        mapColNameToType: {}
    }


    handleColPress = name => {
        const newData = [...this.state.displayData];

        const { recentlySortedCol } = this.state.isSortedAssending

        if (recentlySortedCol == name) {
            // Here we want to sort based on previus col State
            const data = sortData(newData, this.state.isSortedAssending[name], name)
            this.setState(state => ({
                displayData: newData,
                isSortedAssending: {
                    ...state.isSortedAssending,
                    [name]: data.setIsSortedAsc,
                    recentlySortedCol: name
                }
            }))
        } else {
            // Here we want to sort always in ascending Order
            const data = sortData(newData, this.state.isSortedAssending[name], name, true)
            this.setState(state => ({
                displayData: newData,
                isSortedAssending: {
                    ...state.isSortedAssending,
                    [name]: data.setIsSortedAsc,
                    recentlySortedCol: name
                }
            }))
        }
    }

    handleOnRowSelect = (isChecked, id, colName) => {
        const data = this.state.data.map(row => {
            if (row.id != id) return row;
            if ('onRowSelect' in this.props) this.props?.onRowSelect({ ...row, [colName]: isChecked }) // Sending props
            return { ...row, [colName]: isChecked }
        })

        const displayData = this.state.displayData.map(row => {
            if (row.id != id) return row;
            return { ...row, [colName]: isChecked }
        })

        this.setState({
            data,
            displayData
        })
    }

    handleNextPreviousPagePress = (type) => {//next | back
        if (type == 'next') {
            // this.state.activeDisplayDataId
            const activeDisplayId = this.state.activeDisplayDataId;
            const endObj = this.state.endDataArray.find(obj => obj.id == activeDisplayId + 1);
            const startObj = this.state.startDataArray.find(obj => obj.id == activeDisplayId + 1);

            this.setState({
                displayData: this.state.data.slice(startObj?.startData - 1, endObj?.endData),
                activeDisplayDataId: activeDisplayId + 1
            });

        } else if (type == 'back') {
            const activeDisplayId = this.state.activeDisplayDataId;
            const endObj = this.state.endDataArray.find(obj => obj.id == activeDisplayId - 1);
            const startObj = this.state.startDataArray.find(obj => obj.id == activeDisplayId - 1);

            this.setState({
                displayData: this.state.data.slice(startObj?.startData - 1, endObj?.endData),
                activeDisplayDataId: activeDisplayId - 1
            });
        }
    }

    static getDerivedStateFromProps(props, currentState) {
        //this called on every setState() & on mount & on prop changes
        if (JSON.stringify(props.data) === JSON.stringify(currentState.dataPropSnap)) return null;
        //Here below code means that data prop is changed
        let data = props?.data
        let colNames = props?.colNames;
        let colNameSplitter = props?.colNameSplitter;

        if (typeof (data) != 'object') {
            data = [];
        }
        if (typeof (colNames) != 'object') {
            colNames = ['No Columns'];
        }
        if (colNameSplitter != null) {
            if (typeof (colNameSplitter) != 'string') {
                if (colNameSplitter.length != 1) {
                    // colNameSplitter should be single character
                    colNameSplitter = null;
                }
            }
        }

        const mapColNameToType = {}
        props.colSettings?.forEach(setting => {
            if (!colNames.includes(setting.name)) throw new Error('No Column exists which mentioned in provided colSettings prop Name!')
            mapColNameToType[setting.name] = setting.type;
        })
        let start = [];
        let end = []
        if (data.length != 0) {
            const progress = showCurrentProgress(props?.noOfPages, data?.length) //[{id, endData}]
            if (progress) {
                start = progress.start;
                end = progress.end;
            }
        }

        const noOfCols = colNames.length;
        const isSortedAssending = {};
        colNames.forEach(name => {
            isSortedAssending[name] = false;
        })

        // const modifiedData = [...data];
        const modifiedData = data.map((row, index) => {
            if (!row.id) return { ...row, id: index }
            return row;
        })
        // console.log(modifiedData)
        return {
            dataPropSnap: props?.data,
            data: modifiedData,
            displayData: modifiedData.slice(0, end[0]?.endData),
            colNames: [...colNames],
            colNameSplitter: colNameSplitter,
            defaultEachColumnWidth: TOTAL_WIDTH / noOfCols + '%',
            isSortedAssending: { ...currentState.isSortedAssending, ...isSortedAssending },
            activeDisplayDataId: 0, //by default it's zero
            startDataArray: start,
            endDataArray: end,
            mapColNameToType
        };
    }

    render() {

        return (
            <View style={{ ...styles.componentContainer, backgroundColor: this.props.backgroundColor }}
                onLayout={e => {
                    this.setState({ widthOfContainer: e.nativeEvent.layout.width })
                }}>

                <DataTableHeader
                    colNames={this.state.colNames}
                    colNameSplitter={this.state.colNameSplitter}
                    mapColNameToType={this.state.mapColNameToType}
                    defaultEachColumnWidth={this.state.defaultEachColumnWidth}
                    handleColPress={this.handleColPress}
                />

                <Line width={this.state.widthOfContainer} header />

                {
                    this.state.displayData.map((item, index) => (
                        <DataTableRow
                            handleOnRowSelect={this.handleOnRowSelect}
                            widthOfLine={this.state.widthOfContainer}
                            key={index}
                            index={index}
                            data={item}
                            mapColNameToType={this.state.mapColNameToType}
                            colNames={this.state.colNames}
                            style={{ defaultEachColumnWidth: this.state.defaultEachColumnWidth }}
                        />
                    ))
                }

                <DataTableFooter
                    start={this.state.startDataArray}
                    end={this.state.endDataArray}
                    activeDataId={this.state.activeDisplayDataId}
                    dataLength={this.state.data.length}
                    handleNextPreviousPagePress={this.handleNextPreviousPagePress}
                />

            </View>
        );
    }
}

export default DataTable;

const styles = StyleSheet.create({
    componentContainer: {
        backgroundColor: '#e4edec',
    }
});

DataTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    colNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    colSettings: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,//Col Name
            type: PropTypes.string, //radio ||  int || string || icon
        })
    ),
    noOfPages: PropTypes.number,
    onRowSelect: PropTypes.func
}
