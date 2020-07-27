import React, { Component } from "react";
import axios from "axios";
import Loader from "react-loader";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { GET_USERS } from "../constants";
import Input from "../common/Input";
import { MdAdd, MdRemove } from "react-icons/md";
import "./index.scss";
const UUID = "uuid-";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentsArr: [],
      origninalData: [],
      isLoaded: false,
      showModal: false,
      getUserDataURL: "",
      searchBoxData: [],
      accordianOpenIdsArr: [],
      searchByName: "",
      searchByTag: "",
      addTagName: "",
      activeAddTagUUID: "",
      uuidsTags: {},
    };
  }
  componentDidMount() {
    this.fetchUsersData();
  }
  fetchUsersData = () => {
    axios.get(GET_USERS).then(resp => {
      this.setState(
        {
          studentsArr: resp.data.students,
          origninalData: resp.data.students,
          isLoading: true,
        },
        () => {
          const uniqueArr = [];
          [
            ...new Set(
              resp.data.students.map(
                item => `${item.firstName} ${item.lastName}`
              )
            ),
          ].forEach(val => {
            uniqueArr.push({ key: val, value: val });
          });
          this.setState({ searchBoxData: uniqueArr });
        }
      );
    });
  };

  handleOpenModal = url => {
    this.setState({ showModal: true, getUserDataURL: url });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, getUserDataURL: "" });
  };
  handleSearchFilterData = () => {
    const { origninalData, searchByName, searchByTag, uuidsTags } = this.state;
    const massagedArr = origninalData.filter(student => {
      if (searchByName && searchByTag) {
        return (
          `${student.firstName.toLowerCase()} ${student.lastName.toLowerCase()}`.includes(
            searchByName.toLowerCase()
          ) &&
          uuidsTags[`${UUID}${student.id}`] &&
          uuidsTags[`${UUID}${student.id}`].find(text =>
            text.toLowerCase().includes(searchByTag.toLowerCase())
          )
        );
      } else if (searchByName && !searchByTag) {
        return `${student.firstName.toLowerCase()} ${student.lastName.toLowerCase()}`.includes(
          searchByName.toLowerCase()
        );
      } else if (!searchByName && searchByTag) {
        return (
          uuidsTags[`${UUID}${student.id}`] &&
          uuidsTags[`${UUID}${student.id}`].find(text =>
            text.toLowerCase().includes(searchByTag.toLowerCase())
          )
        );
      }
      return student;
    });
    this.setState({ studentsArr: [...massagedArr] });
  };

  handleAccordianChange = uuidsArr => {
    this.setState({ accordianOpenIdsArr: uuidsArr });
  };

  getUsersMassagedData = (user, uuid) => {
    const { pic, firstName, lastName, email, company, skill, grades } = user;
    const {
      accordianOpenIdsArr,
      addTagName,
      uuidsTags,
      activeAddTagUUID,
    } = this.state;
    const availableTags = uuidsTags[uuid] || [];
    return (
      <AccordionItem uuid={uuid}>
        <AccordionItemHeading>
          <AccordionItemButton className="list-item">
            <img src={pic} className="list-item-image" alt="User Avtar" />
            <div className="list-item-content">
              <h2>
                {" "}
                {firstName.toUpperCase()} {lastName.toUpperCase()}{" "}
              </h2>
              <p>Email : {email}</p>
              <p>Company : {company}</p>
              <p>Skill : {skill}</p>
              <p>
                Average :{" "}
                {grades.reduce((a, b) => parseInt(a) + parseInt(b)) /
                  grades.length}
                %
              </p>
            </div>

            <div className="expand-btn">
              {accordianOpenIdsArr.includes(uuid) ? <MdRemove /> : <MdAdd />}
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>

        <AccordionItemPanel>
          <div className="list-item">
            <div className="list-item-content expanded-data">
              {grades.map((score, count) => (
                <div className="score-records">
                  Test {count}: <span className="score-result">{score}%</span>
                </div>
              ))}
              <div className="tags-section">
                {availableTags.map(tag => (
                  <label className="tags">{tag}</label>
                ))}
              </div>
              <Input
                id="add-tag"
                name="add-tag"
                className="search-input-box add-tag-input "
                placeholder="Add a tag"
                onChange={event => this.handleAddTagInput(event, uuid)}
                value={activeAddTagUUID === uuid ? addTagName : ""}
                onKeyPress={event =>
                  this.handleAddTageInputKeyPress(event, uuid)
                }
              />
            </div>
          </div>
        </AccordionItemPanel>
      </AccordionItem>
    );
  };
  handleSearchByName = event => {
    this.setState({ searchByName: event.target.value }, () => {
      this.handleSearchFilterData();
    });
  };
  handleSearchByTag = event => {
    this.setState({ searchByTag: event.target.value }, () => {
      this.handleSearchFilterData();
    });
  };
  handleAddTagInput = (event, uuid) => {
    this.setState({ addTagName: event.target.value, activeAddTagUUID: uuid });
  };
  handleAddTageInputKeyPress = (event, uuid) => {
    if (event.key === "Enter") {
      const { uuidsTags, addTagName } = this.state;
      if (uuidsTags[uuid]) {
        uuidsTags[uuid] = [...uuidsTags[uuid], addTagName];
      } else {
        uuidsTags[uuid] = [addTagName];
      }
      this.setState({ uuidsTags, addTagName: "", activeAddTagUUID: "" });
    }
  };

  render() {
    const {
      studentsArr,
      isLoading,
      searchByName,
      searchByTag,
    } = this.state;
    return (
      <div className="users">
        <div className="list-wrapper">
          {/* <Title title="Users Listing Page" /> */}
          <Input
            id="name-input"
            type="text"
            name="searc-by-name"
            onChange={this.handleSearchByName}
            placeholder={"Search by name"}
            value={searchByName}
            className="search-input-box"
          />
          <Input
            id="tag-input"
            type="text"
            name="search-by-name"
            onChange={this.handleSearchByTag}
            placeholder={"Search by tags"}
            value={searchByTag}
            className="search-input-box"
          />
          <Loader loaded={isLoading}>
            <Accordion
              allowMultipleExpanded
              allowZeroExpanded
              className="list"
              onChange={id => this.handleAccordianChange(id)}
            >
              {studentsArr.map(student => {
                return this.getUsersMassagedData(
                  student,
                  `${UUID}${student.id}`
                );
              })}
            </Accordion>
          </Loader>
        </div>
      </div>
    );
  }
}

export default Dashboard;
