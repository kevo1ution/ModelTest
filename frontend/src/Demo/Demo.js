import React, { Component } from "react";
import classes from "./Demo.module.css";
import BottomNav from "../BottomNav/BottomNav";
import { Swipeable } from "react-swipeable";
import ModelHandler from "../ModelHandler";
import TensorVideo from "../TensorVideo";

let subscriptionKey = "a81d3e6d76a44b9cbd3dea424abefc80";
let host = "api.cognitive.microsoft.com";
let path = "/bing/v7.0/images/search";
let BingSearch = [];

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.swipeUpHandler = this.swipeUpHandler.bind(this);
    this.swipeDownHandler = this.swipeDownHandler.bind(this);
    this.tensorVideo = React.createRef();
    this.correctOnClick = this.correctOnClick.bind(this);
    this.incorrectOnClick = this.incorrectOnClick.bind(this);
  }

  swipeUpHandler() {
    this.setState({ open: true });
    if (!this.tensorVideo.current.prediction) {
      return;
    }
    let term = this.tensorVideo.current.prediction;
    const fetchOptions = {
      method: "get",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    };
    fetch(
      "https://" + host + path + "?q=" + encodeURIComponent(term),
      fetchOptions
    )
      .then(res => res.json())
      .then(res => {
        return (BingSearch = [...new Array(6).keys()].map((v, i) => {
          return {
            img: res.value[i].contentUrl,
            name: res.value[i].name.slice(0, 20) + "...",
            link: res.value[i].webSearchUrl
          };
        }));
      });
  }
  swipeDownHandler() {
    this.setState({ open: false });
  }

  correctOnClick() {
    this.setState({ correct: true, incorrect: false });
  }

  incorrectOnClick() {
    this.setState({ correct: false, incorrect: true });
  }
  render() {
    let drawerClass = null;
    let chevron = null;

    if (this.state.open) {
      drawerClass = classes.googleResultsSwiped;
      chevron = <i className="fas fa-chevron-down"></i>;
    } else {
      drawerClass = classes.googleResults;
      chevron = <i className="fas fa-chevron-up"></i>;
    }
    const allImgs = BingSearch.map(el => {
      return (
        <div className="row">
          <div className="sixteen wide column">
            <a href={el.link} target="_blank">
              <div className={"card " + classes.card}>
                <div className="image">
                  {el.img ? (
                    <img src={el.img} alt="comparison 1" />
                  ) : (
                    <div className={classes.spinner}>
                      <i className="fas fa-spinner fa-pulse"></i>
                    </div>
                  )}
                </div>
                <div className="content">
                  <div className="header">{el.name}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      );
    });

    return (
      <div className={classes.Demo}>
        <TensorVideo
          classifier={
            this.props.content.name === "default"
              ? "default"
              : ModelHandler.getClassifier(this.props.content.name)
          }
          ref={this.tensorVideo}
        ></TensorVideo>
        <div className={this.state.open ? classes.onSwipe : null}>
          <i
            className={
              this.state.correct
                ? "fas fa-check " +
                  classes.correct +
                  " " +
                  classes.correctFilled
                : "fas fa-check " + classes.correct
            }
            onClick={this.correctOnClick}
          ></i>
          <i
            className={
              this.state.incorrect
                ? "fas fa-times " +
                  classes.incorrect +
                  " " +
                  classes.incorrectFilled
                : "fas fa-times " + classes.incorrect
            }
            onClick={this.incorrectOnClick}
          ></i>{" "}
        </div>
        <Swipeable
          onSwipedUp={this.swipeUpHandler}
          onSwipedDown={this.swipeDownHandler}
        >
          <div className={drawerClass}>
            {chevron}
            <h2>Bing Image Results</h2>
            <div className={"container " + classes.container}>
              <div className={"ui grid " + classes.results}>{allImgs}</div>
            </div>
          </div>
        </Swipeable>
        <BottomNav />
        <script src="index.js"></script>
        <BottomNav />
        <script src="index.js"></script>
      </div>
    );
  }
}

export default Demo;
