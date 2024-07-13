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

  /// @dev id of the Symptoms
  struct Symp {
    uint256 id;
    uint8 level;
  }

  struct Intercourse {
    bool useCondom;
    bool hasOrgasm;
    uint8 count;
  }

  struct MenstrualCycleTracking {
    uint256 id;
    uint256 startDate;
    uint256 endDate;
    bool isBegin;
    bool isEnd;
    uint8 bleedingLevel;
    Intercourse intercourse;
    string notes;
  }

  Symptom[] private symptoms;
  Suggestion[] suggestions;

  constructor() {}

  modifier onlyUser() {
    require(!userInfo[msg.sender].isExists, "User not registered");
    _;
  }

  mapping(address => MenstrualCycleTracking[]) mctList;

  /// @dev map id mct to symp
  mapping(address => mapping(uint256 => Symp[])) myMCTSymptoms;

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

  function addMySymptom(
    uint256 _startDate,
    uint256 _endDate,
    bool _isBegin,
    bool _isEnd,
    uint8 _bleedingLevel,
    Intercourse memory _intercourse,
    string memory _notes,
    Symp[] memory _symptoms
  ) public {
    uint256 id = mctId.current();

    MenstrualCycleTracking memory mct = MenstrualCycleTracking({
      id: id,
      startDate: _startDate,
      endDate: _endDate,
      isBegin: _isBegin,
      isEnd: _isEnd,
      bleedingLevel: _bleedingLevel,
      intercourse: _intercourse,
      notes: _notes
    });

    mctId.increment();

    mctList[msg.sender].push(mct);

    for (uint i = 0; i < _symptoms.length; i++) {
      myMCTSymptoms[msg.sender][id].push(_symptoms[i]);
    }
  }

  function getMCTList() public view returns (MenstrualCycleTracking[] memory) {
    return mctList[msg.sender];
  }

  function getMyMCTSymptomsId(uint256 _id) public view returns (Symp[] memory) {
    return myMCTSymptoms[msg.sender][_id];
  }
}
