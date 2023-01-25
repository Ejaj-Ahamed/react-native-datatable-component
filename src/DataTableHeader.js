import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COL_TYPES } from './DataTable';

const PADDING_TOP = 20;

const DataTableHeader = React.memo((props) => {

    const { colNames,colNamez, mapColNameToType, defaultEachColumnWidth, handleColPress,
        doSort, eachColWidth, style, cellBorderColor, cellBorderWidth,cellWidthz } = props;

    const isDoSort = doSort == false ? false : true;

    return (
        <View style={[styles.headerContainer, {
            borderRightWidth: cellBorderWidth,
            borderRightColor: cellBorderColor,
            borderBottomWidth:cellBorderWidth==0?1:0,
            borderBottomColor:cellBorderColor
        }]}>
            {
                colNamez.map((colNamex, index) => {
                    let colName = colNamex['name'];
                    const colWidth = cellWidthz || 150;
                    // const colWidth = eachColWidth[colName] == undefined ? defaultEachColumnWidth : eachColWidth[colName];
                    const colType = mapColNameToType[colName]
                    const justifyContent = (colType == COL_TYPES.STRING || colType == null) ? 'flex-start' : (colType == COL_TYPES.CHECK_BOX || colType == COL_TYPES.RADIO) ? 'center' : 'flex-end'
                    let paddingLeft = 0;
                    let paddingRight = 0;
                    if (justifyContent == 'flex-start') {
                        paddingLeft = 13
                        paddingRight = 1;
                    } else if (justifyContent == 'flex-end') {
                        paddingRight = 13;
                        paddingLeft = 1
                    }
                    if (colType == COL_TYPES.CHECK_BOX) {
                        return (
                            <View key={index} style={[styles.headerRow, { width: colWidth, justifyContent }, {
                                borderLeftColor: cellBorderColor,
                                borderLeftWidth: cellBorderWidth,
                                borderTopWidth: cellBorderWidth,
                                borderTopColor: cellBorderColor
                            }]}>
                                <Text style={[styles.headerLabel, { textAlign: 'center' }, style]} adjustsFontSizeToFit={true} numberOfLines={20}>{' ' + colName}</Text>
                            </View>
                        )
                    }
                    if (isDoSort) {
                        return (
                            <View key={index} style={[styles.headerRow, { width: colWidth, paddingLeft, paddingRight },{
                                borderLeftColor: cellBorderColor,
                                borderLeftWidth: cellBorderWidth,
                                borderTopWidth: cellBorderWidth,
                                borderTopColor: cellBorderColor,
                                borderBottomWidth: cellBorderWidth,
                                borderBottomColor: cellBorderColor
                            }]}>
                                <TouchableOpacity onPress={handleColPress.bind(null, colName)} style={{
                                    width: "100%",
                                    flexDirection: "row",
                                }}>
                                    <View style={{ flex: paddingRight == 13 ? 1 : undefined, alignItems: paddingRight == 13 ? 'flex-end' : undefined, minWidth: 8 }}>
                                        <Image source={require('../assets/doubleArrow.png')} />
                                    </View>
                                    <View style={{ width: paddingLeft == 13 ? '71%' : undefined }}>
                                        <Text
                                            adjustsFontSizeToFit={true}
                                            numberOfLines={1}
                                            style={[styles.headerLabel, style]}>
                                            {' ' + colName}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    } else {
                        const isLeft = paddingLeft == 1 ? false : true;
                        return (
                            <View style={{ width: colWidth, paddingTop: PADDING_TOP, paddingBottom: 18 }} key={index}>
                                <Text style={{ ...styles.headerLabel, paddingLeft, paddingRight, textAlign: isLeft ? 'left' : 'right', left: isLeft ? -0.5 : undefined, ...style }}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={20}
                                >
                                    {colName}</Text>
                            </View>
                        )
                    }
                })
            }
        </View>
    );
})

export default DataTableHeader;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
    },
    headerRow: {
        paddingTop: PADDING_TOP,
        paddingBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
    },
    headerLabel: {
        color: 'grey',
        fontSize: 12
    }
});
