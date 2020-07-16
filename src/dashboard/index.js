import React, { Component } from "react";
import axios from "axios";
import Loader from "react-loader";
import ReactSearchBox from "react-search-box";
import { GET_USERS } from "../constants";
import Title from "../common/Title";
import Modal from "../common/Modal";
import "./index.scss";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersData: [],
      origninalData: [],
      isLoaded: false,
      showModal: false,
      getUserDataURL: "",
      searchBoxData: [],
    };
  }
  componentDidMount() {
    this.fetchUsersData();
  }
  fetchUsersData = () => {
    axios.get(GET_USERS).then((resp) => {
      this.setState(
        { usersData: resp.data, origninalData: resp.data, isLoading: true },
        () => {
          const uniqueArr = [];
          [...new Set(resp.data.map((item) => item.type))].forEach((val) => {
            uniqueArr.push({ key: val, value: val });
          });
          this.setState({ searchBoxData: uniqueArr });
        }
      );
    });
  };

  handleOpenModal = (url) => {
    this.setState({ showModal: true, getUserDataURL: url });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, getUserDataURL: "" });
  };
  handleSearchFilterData = (value) => {
    const { origninalData } = this.state;
    const massagedArr = origninalData.filter(
      (item) => item.type.toLowerCase().includes(value.toLowerCase())
    );
    this.setState({ usersData: [...massagedArr] });
  };

  getUsersMassagedData = (user) => {
    const { avatar_url, login, type, url } = user;
    return (
      <li className="list-item" onClick={() => this.handleOpenModal(url)}>
        <div>
          <img src={avatar_url} className="list-item-image" alt="User Avtar" />
        </div>
        <div className="list-item-content">
          <h4>Login : {login}</h4>
          <p>Type : {type}</p>
        </div>
      </li>
    );
  };
  render() {
    const {
      usersData,
      isLoading,
      showModal,
      getUserDataURL,
      searchBoxData,
    } = this.state;
    return (
      <div className="users">
        <div className="list-wrapper">
          <Title title="Users Listing Page" />
          <ReactSearchBox
            placeholder="Search By User Type"
            value=""
            data={searchBoxData}
            onChange={(record) => {
              this.handleSearchFilterData(record);
            }}
          />
          <Loader loaded={isLoading}>
            <ul className="list">
              {usersData.map((user) => {
                return this.getUsersMassagedData(user);
              })}
            </ul>
          </Loader>
          {getUserDataURL && (
            <Modal
              url={getUserDataURL}
              showModal={showModal}
              closeModalCallBack={this.handleCloseModal}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
