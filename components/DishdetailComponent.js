import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Picker, Switch, Button, Modal, TextInput, FlatList } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments'
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

 
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderComments(props) {
    const comments = props.comments;
    const RenderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating 
                    type="star"
                    fractions={0}
                    startingValue={+item.rating}
                    imageSize={10}
                    readonly
                    style={{alignItems: 'flex-start', paddingVertical: '5%'}}
                />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }
 
    return (
        <Card title="comments">
            <FlatList
                data={comments}
                renderItem={RenderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
 }

function RenderDish(props) {

    const dish = props.dish;
    
    if (dish != null) {
        return(
            <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
}

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        };
    }


    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    handleComment(dishId) {
        this.toggleModal();        
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const { rating } = this.props;
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]}
                favorite={this.props.favorites.some(el => el === dishId)}
                onPress={() => this.markFavorite(dishId)} 
                />
   
                    <Icon
                            reverse
                            name='heart-o'
                            type='font-awesome'
                            color='#ff5500'
                            onPress={() => this.markFavorite(dishId)}
                        />
                    <Icon
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#517fa4'
                            onPress={() => this.toggleModal()}
                        />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                <View style = {styles.modal}>
                     
                        <Rating
                            showRating
                            fractions={0}
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={(rating)=>this.setState({rating: rating})}
                            style={{ paddingVertical: 10 }}

                        />
            
                
                        <Input
                            placeholder=" Author"
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={(author) => {this.setState({author: author})}}
                            value={this.state.author}
                        />

                   
                

                        <Input
                            placeholder=" Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={(comment) => {this.setState({comment: comment})}}
                            value={this.state.comment}
                        />

                    
                                   
                        <Button
                        onPress={() => this.handleComment(dishId)}
                        title="submit"
                        color="#512DA8"
                        accessibilityLabel="Learn more about this purple button"
                        />
                    
                    
                        <Button 
                            onPress = {() =>{this.toggleModal(); this.resetForm() }}
                            color="#666666"
                            title="cancell" 
                            />
                    </View>
                    
                         
            </Modal>
        </ScrollView>
        );
    }
};
const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }  
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);