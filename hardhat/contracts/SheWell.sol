//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";

contract SheWell is Ownable {
  using Counters for Counters.Counter;

  /// @dev Symptom id counter
  Counters.Counter symptomId;

  /// @dev Menstrual Cycle Tracking id counter
  Counters.Counter mctId;

  struct User {
    string name;
    string content;
    bool isExists;
  }

  struct Suggestion {
    uint8 startDay;
    uint8 endDay;
    string content;
  }

  struct Symptom {
    uint256 id;
    string name;
    string emoji;
  }

  struct MenstrualCycleTracking {
    uint256 id; // counter id
    string title;
    uint256 eventDate;
    string content;
  }

  Symptom[] private symptoms;
  Suggestion[] suggestions;

  constructor() {}

  modifier onlyUser() {
    require(!userInfo[msg.sender].isExists, "User not registered");
    _;
  }

  mapping(address => MenstrualCycleTracking[]) mctList;

  mapping(address => User) userInfo;

  function registerUser(string memory _name, string memory _content) public {
    userInfo[msg.sender] = User({
      name: _name,
      content: _content,
      isExists: true
    });
  }

  function getMyUserInfo() public view returns (User memory) {
    return userInfo[msg.sender];
  }

  function addSuggestion(
    uint8 _startDay,
    uint8 _endDay,
    string memory _content
  ) public onlyOwner {
    suggestions.push(
      Suggestion({startDay: _startDay, endDay: _endDay, content: _content})
    );
  }

  function addSymptom(
    string memory _name,
    string memory _emoji
  ) public onlyOwner {
    uint256 id = symptomId.current();
    symptoms.push(Symptom({id: id, name: _name, emoji: _emoji}));
    symptomId.increment();
  }

  function getSuggestions() public view onlyUser returns (Suggestion[] memory) {
    return suggestions;
  }

  function getSymptoms() public view returns (Symptom[] memory) {
    return symptoms;
  }

  function addMCTItem(
    string memory _title,
    uint256 _eventDate,
    string memory _content
  ) public {
    uint256 id = mctId.current();

    MenstrualCycleTracking memory mct = MenstrualCycleTracking({
      id: id,
      title: _title,
      eventDate: _eventDate,
      content: _content
    });

    mctList[msg.sender].push(mct);

    mctId.increment();
  }

  function getLastMCTID() public view returns (uint256) {
    return mctId.current() - 1;
  }

  function modifyMCTItem(
    uint256 _id,
    string memory _title,
    string memory _content
  ) public {
    for (uint i = 0; i < mctList[msg.sender].length; i++) {
      if (mctList[msg.sender][i].id == _id) {
        mctList[msg.sender][i].title = _title;
        mctList[msg.sender][i].content = _content;
        break;
      }
    }
  }

  function getMCTList() public view returns (MenstrualCycleTracking[] memory) {
    return mctList[msg.sender];
  }
}
