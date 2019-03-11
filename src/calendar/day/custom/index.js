import React, { Component } from "react";
import { TouchableOpacity, Text, View, I18nManager } from "react-native";
import PropTypes from "prop-types";

import styleConstructor from "./style";
import { shouldUpdate } from "../../../component-updater";
import { getPxForWidth, getPxForHeight } from "../../../../../../utils";

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(["selected", "disabled", "today", ""]),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, [
      "state",
      "children",
      "marking",
      "onPress",
      "onLongPress"
    ]);
  }

  render() {
    let containerStyle = [this.style.base];
    let textStyle = [this.style.text];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    const isDisabled =
      typeof marking.disabled !== "undefined"
        ? marking.disabled
        : this.props.state === "disabled";

    if (marking.selected) {
      containerStyle.push(this.style.selected);
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === "today") {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    if (marking.customStyles && typeof marking.customStyles === "object") {
      const styles = marking.customStyles;
      if (styles.container) {
        if (styles.container.borderRadius === undefined) {
          styles.container.borderRadius = 16;
        }
        containerStyle.push(styles.container);
      }
      if (styles.text) {
        textStyle.push(styles.text);
      }
    }

    return (
      <TouchableOpacity
        disabled={
          typeof this.props.marking.disabled !== "undefined"
            ? this.props.marking.disabled
            : this.props.state === "disabled"
        }
        style={containerStyle}
        onPress={this.onDayPress}
        onLongPress={this.onDayLongPress}
        activeOpacity={marking.activeOpacity}
      >
        <Text allowFontScaling={false} style={textStyle}>
          {String(this.props.children)}
        </Text>
        {this.props.state === "disabled" || this.props.marking.disabled ? (
          <View
            style={{
              position: "absolute",
              top: -getPxForWidth(15),
              left: I18nManager.isRTL ? getPxForWidth(12) : -getPxForWidth(12),
              width: getPxForWidth(40),
              height: getPxForWidth(40),
              borderBottomWidth: 1,
              borderBottomColor: "#c4d4da",
              transform: [{ rotate: "-40deg" }]
            }}
          />
        ) : null}
      </TouchableOpacity>
    );
  }
}

export default Day;
