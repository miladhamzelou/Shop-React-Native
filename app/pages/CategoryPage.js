/**
 * ShopReactNative
 *
 * @author Tony Wong
 * @date 2016-08-13
 * @email 908601756@qq.com
 * @copyright Copyright © 2016 EleTeam
 * @license The MIT License (MIT)
 */

'use strict';

import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Text,
    InteractionManager,
    TouchableOpacity,
    Alert
} from 'react-native';
import {categoryListWithProduct} from '../actions/productActions';
import Loading from '../components/Loading';

//页面变量
let isLoading = true;
let products = [];

export default class CategoryPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //交互管理器在任意交互/动画完成之后，允许安排长期的运行工作. 在所有交互都完成之后安排一个函数来运行。
        InteractionManager.runAfterInteractions(() => {
            const {dispatch} = this.props;
            dispatch(categoryListWithProduct(isLoading));
        });
    }

    render() {
        const {productReducer} = this.props;
        let categories = productReducer.categories;
        // alert(productReducer.isLoading);
        if (!productReducer.isLoading){
            products = categories[0].products;
            // Alert.alert(products);
        }

        return (
            <View style={styles.container}>
                {productReducer.isLoading ?
                    <Loading /> :
                    <View style={styles.container}>
                        <CategoryList categories={categories}/>
                        <ProductList/>
                    </View>
                }
            </View>
        )
    }
}

class CategoryList extends React.Component {
    constructor(props) {
        super(props);

        this._renderRow = this._renderRow.bind(this);

        let dataSource = new ListView.DataSource({
            getRowData: (data, sectionId, rowId) => {
                return data[sectionId][rowId];
            },
            getSectionHeaderData: (data, sectionId) => {
                return data[sectionId];
            },
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
        });

        this.state = {
            dataSource: dataSource.cloneWithRows(props.categories)
        }
    }

    render() {
        return (
            <View style={styles.categoryList}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    activeOpacity={1}
                    onPress={()=>this.handleSortTypesViewAnimation()}
                />
            </View>
        )
    }

    _renderRow(category, sectionId, rowId) {
        return (
            <TouchableOpacity
                style={styles.foodsCell}
                onPress={this._onPressCategoryItem.bind(this, rowId)}
            >
                <View style={styles.categoryItem}>
                    <Text>{category.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    _onPressCategoryItem(rowId) {
        products = this.props.categories[rowId];
        // Alert.alert(products);
    }
}

class ProductList extends React.Component {
    constructor(props) {
        super(props);

        this._renderRow = this._renderRow.bind(this);

        let dataSource = new ListView.DataSource({
            getRowData: (data, sectionId, rowId) => {
                return data[sectionId][rowId];
            },
            getSectionHeaderData: (data, sectionId) => {
                return data[sectionId];
            },
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
        });

        this.state = {
            dataSource: dataSource.cloneWithRows(products)
        }
    }

    render() {
        return (
            <View style={styles.productList}>
                <ListView style={styles.productList}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                />
            </View>
        )
    }

    _renderRow(product, sectionId, rowId) {
        return (
            <View>
                <Text>{product.name}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
    },
    categoryList: {
        backgroundColor: '#88f0f3',
        width: 70,
    },
    productList: {
        backgroundColor: '#aaaaf3',
        flex: 1,
    },

    categoryItem:{
        alignItems: 'center',    //水平居中
        justifyContent: 'center',//垂直居中
        height:50,
    },
    category_bg_select:{
        backgroundColor:'#d7ead6',
    },
    category_bg_normal:{
        backgroundColor:'#ffffff',
    },
    line:{
        backgroundColor:'#eef0f3',
        height:1,
    },
});