import React, { Component } from  'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import PropTypes from 'prop-types';
import './EditBookmark.css';

const Required = () => (
    <span className='AddBookmark__required'>*</span>
)

export default class EditBookmark extends Component {
    static contextType = BookmarksContext

    state = {
        error: null,
        id: '',
        title: '',
        url: '',
        description: '',
        rating: '',
      };
    
    componentDidMount() {
    fetch(config.LOCAL_API_ENDPOINT + `/${this.props.match.params.id}`, {
        method: 'GET',
        headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.LOCAL_API_KEY}`
        }
    })
        .then(res => {
        if (!res.ok) {
            throw new Error(res.status)
        }
        return res.json()
        })
        .then(data => {
            this.setState({
                id: data.id,
                title: data.title,
                url: data.url,
                description: data.description,
                rating: data.rating
            })
        })
        .catch(error => this.setState({ error }))
    }

    handleChangeTitle = e => {
        this.setState({ title: e.target.value })
    };

    handleChangeUrl = e => {
        this.setState({ url: e.target.value })
    };

    handleChangeDescription = e => {
        this.setState({ description: e.target.value })
    };

    handleChangeRating = e => {
        this.setState({ rating: e.target.value })
    };
    
    handleSubmit = e => {
    e.preventDefault()
    // get the form fields from the event
    const { id, title, url, description, rating } = this.state
    const bookmark = { id, title, url, description, rating }
    const targetURL = config.LOCAL_API_ENDPOINT + '/' + this.props.match.params.id;

    this.setState({ error: null })
    fetch(targetURL, {
        method: 'PATCH',
        body: JSON.stringify(bookmark),
        headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${config.LOCAL_API_KEY}`
        }
    })
        .then(res => {
        if (!res.ok) {
            // get the error message from the response,
            return res.json().then(error => {
            // then throw it
            throw error
            })
        }
        })
        .then(() => {
        this.context.editBookmark(bookmark)
        this.props.history.push('/')
        })
        .catch(error => {
        this.setState({ error })
        })
    }

    handleClickCancel = () => {
    this.props.history.push('/');
    };

    render() {
    const { error } = this.state
    const { title, url, description, rating } = this.state

    return (
        <section className='EditBookmark'>
        <h2>Edit bookmark</h2>
        <form
            className='EditBookmark__form'
            onSubmit={this.handleSubmit}
        >
            <div className='EditBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
            </div>
            <div>
            <label htmlFor='title'>
                Title
                {' '}
                <Required />
            </label>
            <input
                type='text'
                name='title'
                id='title'
                value={title}
                onChange={this.handleChangeTitle}
                required
            />
            </div>
            <div>
            <label htmlFor='url'>
                URL
                {' '}
                <Required />
            </label>
            <input
                type='url'
                name='url'
                id='url'
                value={url}
                onChange={this.handleChangeUrl}
                required
            />
            </div>
            <div>
            <label htmlFor='description'>
                Description
            </label>
            <textarea
                name='description'
                id='description'
                value={description}
                onChange={this.handleChangeDescription}
            />
            </div>
            <div>
            <label htmlFor='rating'>
                Rating
                {' '}
                <Required />
            </label>
            <input
                type='number'
                name='rating'
                id='rating'
                value={rating}
                onChange={this.handleChangeRating}
                min='1'
                max='5'
                required
            />
            </div>
            <div className='EditBookmark__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
                Cancel
            </button>
            {' '}
            <button type='submit'>
                Save
            </button>
            </div>
        </form>
        </section>
        );
      }
    }
    
    EditBookmark.propTypes = {
      title: PropTypes.string.isRequired,
      url: (props, propName, componentName) => {
        // get the value of the prop
        const prop = props[propName];
    
        // do the isRequired check
        if(!prop) {
          return new Error(`${propName} is required in ${componentName}. Validation Failed`);
        }
    
        // check the type
        if (typeof prop != 'string') {
          return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
        }
    
        // do the custom check here
        // using a simple regex
        if (prop.length < 5 || !prop.match(new RegExp(/^https?:\/\//))) {
          return new Error(`Invalid prop, ${propName} must be min length 5 and begin http(s)://. Validation Failed.`);
        }
      },
      rating: PropTypes.number,
      description: PropTypes.string
    };