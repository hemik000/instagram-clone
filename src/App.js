import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Components/Post";
import { db, auth } from "./Config/firebase";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Upload from "./Components/Upload";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      position: "absolute",
      [theme.breakpoints.down("xs")]: {
        width: 280,
      },
      width: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  };
});

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setIsOpen(false)
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setIsLoginOpen(false);
  };
  return (
    <div className="app">
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <h2>Sign Up</h2>
            </center>
            <Input
              required={true}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button
              disabled={!email || !password || !username}
              type="submit"
              onClick={signUp}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <h2>Sign In</h2>
            </center>
            <Input
              required={true}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              required={true}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button
              type="submit"
              disabled={!email || !password}
              onClick={signIn}
            >
              Log In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__header_logo"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        <div>
          {user ? (
            <Button onClick={() => auth.signOut()}>Log Out</Button>
          ) : (
            <>
              <Button onClick={() => setIsLoginOpen(true)}>Sign In</Button>
              <Button onClick={() => setIsOpen(true)}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
      <center>
        {user?.displayName ? (
          <Upload username={user.displayName} />
        ) : (
          <h3>You need to login to Post and Comment</h3>
        )}
      </center>

      <div className="app__main_post">
        <div className="main__post_section">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              image={post.imageUrl}
              caption={post.caption}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
