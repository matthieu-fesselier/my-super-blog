import React from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import Prismic from 'prismic-javascript';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      blogPosts: []
    }
  }

  async getBlogPosts() {
    return Prismic.api('https://my-super-blog.cdn.prismic.io/api/v2')
    .then(api => (
      api.query(
        Prismic.Predicates.at('document.type', 'blog_post'),
        {
          pageSize: 100,
          orderings: '[document.first_publication_date]'
        }
      )
    ))
  }

  componentDidMount() {
    this.getBlogPosts().then(response => {
      this.setState({ blogPosts: response.results })
    })
  }

  _renderItem = ({ item }) => (
    <View>
      <Image
        style={{ width: 350, height: 200 }}
        source={{ uri: item.data.image.url }}
      />
      <Text style={styles.postTitle}>{item.data.title[0].text}</Text>
      <Text>{item.data.text[0].text}</Text>
    </View>
  )

  render() {
    return(
      <View style={styles.container}>
        <FlatList
          keyExtractor={item => item.id}
          data={this.state.blogPosts}
          extraData={this.state}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  }
});
