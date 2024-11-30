// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract Project {
    event tokenCreated(bytes32 token);

    mapping(address => bytes32[]) users;
    mapping(bytes32 => uint) songsWithListenings;

    bytes32[] songs;

    uint perOneThousand = 3;

    modifier isRegistered(address user) {
        require(users[user].length != 0, "User is not registered");
        _;
    }

    modifier songExists(bytes32 song) {
        require(songsWithListenings[song] != 0, "Song token is invalid");
        _;
    }

    function getTokenForSong(address author) public isRegistered(author){
        uint songCount = users[author].length;
        console.log("We are ok before concatenate strings.");
        string memory inputForHash = concatenate(toString(author), toString(songCount));
        console.log("We are ok after concatenate strings.");
        bytes32 songToken = sha256(abi.encode(inputForHash));
        console.log("We are ok after compute hash.");
        songsWithListenings[songToken] = 1;
        songs.push(songToken);
        users[author].push(songToken);
        emit tokenCreated(songToken);
        console.log("Event emited...");
    }

    function register(address user) public {
        users[user] = [bytes32("0x0")];
    }

    function checkIsRegistered(address user) public view returns(bool){
        return users[user].length > 0;
    }

    function listenSong(bytes32 songToken) public songExists(songToken){
        songsWithListenings[songToken] += 1;
    }

    function getListenings(bytes32 songToken) public view songExists(songToken) returns (uint){
        return songsWithListenings[songToken];
    }

    function getRoyalty(bytes32 songToken) public view songExists(songToken) returns (uint){
        console.log(perOneThousand * songsWithListenings[songToken]);
        return perOneThousand * (songsWithListenings[songToken] - 1);
    }

    function getRoyaltyWithPartner(bytes32 songToken, uint numberOfListenings) public view songExists(songToken) returns (uint){
        return perOneThousand * (numberOfListenings - 1);
    }

    function getUsersSongs(address user) public view returns (bytes32[] memory){
        return users[user];
    }

    function getSongs() public view returns (bytes32[] memory){
        return songs;
    }

    function syncListenings(bytes32 songToken, uint numberOfListenings) public songExists(songToken) {
        songsWithListenings[songToken] += numberOfListenings - songsWithListenings[songToken] + 1;
        console.log("Listenings for token");
        console.log(songsWithListenings[songToken]);
    }

    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }

        console.log("We are ok with generating strings from uint", string(buffer));
        return string(buffer);
    }

    function toString(address _address) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes20 value = bytes20(_address);
        bytes memory str = new bytes(42); // "0x" + 40 hex characters
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i] & 0x0f)];
        }

        console.log("We are ok with create string from address", string(str));
        return string(str);
    }

    function concatenate(
       string memory _In1, string memory _In2) 
        public pure returns(string memory){
           return string(
           abi.encodePacked(_In1, _In2));
           }
}
