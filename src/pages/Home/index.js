import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Heading, Container, Border } from 'rebass'
import OAEP from '../../lib/oaep';
import uuidv4 from 'uuid/v4'

const testDocuments = async (count) => {
  const documents = [...Array(count)]
  const res = []

  for (const doc of documents) {
    res.push({
      uuid: uuidv4(),
      ...(await OAEP.genKey())
    })
  }

  return res
}

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      documents: []
    }
  }

  async componentDidMount() {
    this.setState({ documents: await testDocuments(4) })
  }

  render() {
    return (
      <Container mt={4}>
        <Heading>Recent Pads</Heading>
          {this.state.documents.map((d) => (
            <Border key={d.uuid} p={2} mt={2}>
              <Link to={`/editor/${d.uuid}/${d.privateKey}/${d.publicKey}`}>{d.uuid}</Link>
            </Border>
          ))}
      </Container>
    );
  }
}

export default Home;
