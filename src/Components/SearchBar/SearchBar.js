import React, { Component } from "react";
import "./SearchBar.css";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.state = { term: "" };
    this.handleTermChange = this.handleTermChange.bind(this);
  }
  search() {
    this.props.onSearch(this.state.term);
  }
  handleTermChange(e) {
    this.setState({ term: e.target.value });
  }
  render() {
    return (
      <div className="SearchBar">
        {console.log(this.state.term)}
        <input
          onChange={this.handleTermChange}
          placeholder="Enter A Song, Album, or Artist"
        />
        <button className="SearchButton" onClick={this.search}>
          SEARCH
        </button>
      </div>
    );
  }
}

export default SearchBar;
