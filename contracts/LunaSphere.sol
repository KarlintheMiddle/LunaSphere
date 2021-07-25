pragma solidity >=0.4.22 <0.9.0;

contract LunaSphere{
    string public name = "LunaSphere";
    string public symbol = "LNS";
    string public standard = "Luna Sphere v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
        //allocate initial supply
    }

    //TRANSFER FUNCTION
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        //trigger transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    //APPROVE FUNCTION
    function approve(address _spender, uint256 _value) public returns (bool success) {
        //set allowance
        allowance[msg.sender][_spender] = _value;
        
        //trigger approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    //TRANSFERFROM FUNCTION FOR EXCHANGE
    function transferFrom(address _from, address _to, uint256 _value)public returns(bool success) {
      require(_value <= balanceOf[_from]);
      require(_value <= allowance[_from][msg.sender]);

      balanceOf[_from] -= _value;
      balanceOf[_to] += _value;

      allowance[_from][msg.sender] -= _value;

      emit Transfer(_from, _to, _value);

      return true;
    }
}