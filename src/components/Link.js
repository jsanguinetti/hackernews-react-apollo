import React, { Component } from 'react'
import { USER_ID } from '../constants'
import { gql, graphql } from 'react-apollo'

class Link extends Component {

  render() {
    const userId = localStorage.getItem(USER_ID)
    return (
      <div className='flex mt2 items-start'>
        <div className='flex items-center'>
          <span className='gray'>{this.props.index + 1}.</span>
          {userId && <div className='ml1 gray f11' onClick={() => this._voteForLink()}>▲</div>}
        </div>
        <div className='ml1'>
          <div>{this.props.link.description} ({this.props.link.url})</div>
          <div className='f6 lh-copy gray'>{this.props.link.votes.length} votes | by {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'}</div>
        </div>
      </div>
    )
  }
  
  _voteForLink = async () => {
    const userId = localStorage.getItem(USER_ID)
    const voterIds = this.props.link.votes.map(vote => vote.user.id)
    if (voterIds.includes(userId)) {
      console.log(`User (${userId}) already voted for this link.`)
      return
    }
  
    const linkId = this.props.link.id
    await this.props.createVoteMutation({
      variables: {
        linkId
      },
      update: (store, { data: { createVote } }) => {
        this.props.updateStoreAfterVote(store, createVote, linkId)
      }
    })
  }
}

const CREATE_VOTE_MUTATION = gql`
mutation CreateVoteMutation($linkId: ID!) {
  createVote(linkId: $linkId) {
    id
    link {
      votes {
        id
        user {
          id
        }
      }
    }
    user {
      id
    }
  }
}
`

export default graphql(CREATE_VOTE_MUTATION, {
  name: 'createVoteMutation'
})(Link)