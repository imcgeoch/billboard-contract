pragma solidity ^0.4.2;

contract Billboard {

 modifier onlyOwner(uint16 _cell) {
	     require (msg.sender == cells[_cell].owner);
			     _;
 }

 mapping(address => uint) pendingWithdrawals;
		
 struct Cell {
   uint price;
	 address owner;
 }

 Cell[3200] public cells;
 bytes4[3200] public characters;

 modifier onBoard(uint16 _cell) {
   require (_cell < 3200);
	 _;
 }

 function Billboard() {

 }

 function change(uint16 cell, bytes4 character)
   onBoard(cell) onlyOwner(cell) public {
   characters[cell] = character;
 }


 function purchase(uint16 cell) public payable onBoard(cell){
   uint amt = msg.value;
	 require(amt >= cells[cell].price);

	 pendingWithdrawals[cells[cell].owner] += amt;
   cells[cell].owner = msg.sender;
 }

 function setPrice(uint16 cell, uint newprice) 
  onBoard(cell) onlyOwner(cell) public {
		cells[cell].price = newprice;
	}

 function withdraw() {
   uint amount = pendingWithdrawals[msg.sender];
   pendingWithdrawals[msg.sender] = 0;
   msg.sender.transfer(amount);
 }

 function getCells() public returns (bytes4[3200]) {
   return (characters);   
 }

}
