//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SheWell {
  struct User {
    string name;
    string content;
    bool isExists;
  }

  constructor() {}

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
}
