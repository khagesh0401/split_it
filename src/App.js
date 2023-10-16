import { fireEvent } from "@testing-library/react";
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friend, setfriend] = useState(initialFriends);
  const [showAddfriend, setshowAddfriend] = useState(false);
  const [selectedfriend, setselectedfriend] = useState(null);
  function handleaddfriend() {
    setshowAddfriend(!showAddfriend);
  }
  function addfriend(newfriend) {
    setfriend((f) => [...f, newfriend]);
    setshowAddfriend(false);
  }
  function onSelect(friend) {
    setselectedfriend((cur) => (cur?.id === friend.id ? null : friend));
    setshowAddfriend(false);
  }
  function handlesplitbill(value) {
    setfriend((friend) =>
      friend.map((friend) =>
        friend.id === selectedfriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setselectedfriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friendlist
          friend={friend}
          onSelect={onSelect}
          selectedfriend={selectedfriend}
        />
        {showAddfriend && <FormAddfriend onAddfriend={addfriend} />}
        <Button onClick={handleaddfriend}>
          {showAddfriend ? "Close" : "Add Friends"}
        </Button>
      </div>
      {selectedfriend && (
        <FormSplitBill
          selectedfriend={selectedfriend}
          handlesplitbill={handlesplitbill}
        />
      )}
    </div>
  );
}

function Friendlist({ friend, onSelect, selectedfriend }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedfriend={selectedfriend}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedfriend }) {
  const isselected = selectedfriend?.id === friend.id;

  return (
    <li className={isselected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} Rs. {Math.abs(friend.balance)}.
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you Rs. {Math.abs(friend.balance)}.
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

      <Button onClick={() => onSelect(friend)}>
        {selectedfriend && isselected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddfriend({ onAddfriend }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");
  function handlesubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newfriend = {
      id: `${id}`,
      name: `${name}`,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddfriend(newfriend);
    setname("");
    setimage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handlesubmit(e)}>
      <label>🧑‍🤝‍🧑friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      ></input>

      <label>🦚 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedfriend, handlesplitbill }) {
  const [billvalue, setbillvalue] = useState("");
  const [yourexpense, setyourexpense] = useState("");
  const [whopaid, setwhopaid] = useState("user");
  const paidbyfriend = billvalue ? billvalue - yourexpense : "";

  function splitbill(e) {
    e.preventDefault();

    if (!billvalue || !yourexpense) return;
    handlesplitbill(whopaid === "user" ? paidbyfriend : -yourexpense);
  }
  return (
    <form className="form-split-bill" onSubmit={(e) => splitbill(e)}>
      <h2>Split a bill with {selectedfriend.name}</h2>

      <label>🤑Bill value:</label>
      <input
        type="text"
        value={billvalue}
        onChange={(e) => setbillvalue(Number(e.target.value))}
      ></input>

      <label>🔆Your expense:</label>
      <input
        type="text"
        value={yourexpense}
        onChange={(e) =>
          e.target.value < billvalue && setyourexpense(Number(e.target.value))
        }
      ></input>

      <label>🐈{selectedfriend.name}'s expense:</label>
      <input type="number" disabled value={paidbyfriend}></input>

      <label>🐨Who is paying the bill?</label>
      <select value={whopaid} onChange={(e) => setwhopaid(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
