import React, { useState, Fragment } from 'react';

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var postDataByRest = function postDataByRest(restUrl, data) {
  try {
    try {
      var webUrl = window._spPageContextInfo.siteServerRelativeUrl;
      return Promise.resolve(getFormDigest(webUrl).then(function (formDigestData) {
        return fetch(restUrl, {
          method: "post",
          headers: {
            "Content-Type": "application/json;odata=verbose",
            Accept: "application/json;odata=verbose",
            "X-RequestDigest": formDigestData.d.GetContextWebInformation.FormDigestValue
          },
          credentials: "include",
          body: JSON.stringify(data)
        }).then(function (response) {
          return response.json().then(function (json) {
            var result = [];
            if (json.d.ClientPeoplePickerSearchUser) result = json;
            return result;
          });
        });
      }));
    } catch (error) {
      throw error;
    }
  } catch (e) {
    return Promise.reject(e);
  }
};
var getUserSuggesstions = function getUserSuggesstions(query) {
  try {
    if (!SP_SITE_URL) {
      return Promise.resolve('This people picker works only in SharePoint context');
    }

    var queryURL = SP_SITE_URL + PEOPLE_PICKER_URL;
    return Promise.resolve(_catch(function () {
      return Promise.resolve(postDataByRest(queryURL, query));
    }, function (error) {
      console.log(error);
      throw error;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var SP_SITE_URL = window._spPageContextInfo ? window._spPageContextInfo.siteAbsoluteUrl : null;
var PEOPLE_PICKER_URL = '/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.ClientPeoplePickerSearchUser';

var styles = {"spPplPickerInput":"_1997U","no-suggestions":"_2odnM","suggestions":"_2QNZO","suggestion-active":"_3Wx9d","request-search-box":"_GJn_K","request-search-icon":"_1OOf5"};

var userQueryObj = {
  queryParams: {
    QueryString: "",
    MaximumEntitySuggestions: 10,
    AllowEmailAddresses: true,
    AllowOnlyEmailAddresses: false,
    PrincipalSource: 2,
    PrincipalType: 1,
    SharePointGroupID: 0
  }
};

var SpPeoplePicker = function SpPeoplePicker(props) {
  var _useState = useState(""),
      activeSuggestion = _useState[0],
      setActiveSuggestion = _useState[1];

  var _useState2 = useState([]),
      filteredSuggestions = _useState2[0],
      setFilteredSuggestions = _useState2[1];

  var _useState3 = useState([]),
      showSuggestions = _useState3[0],
      setShowSuggestions = _useState3[1];

  var _useState4 = useState(""),
      userInput = _useState4[0],
      setUserInput = _useState4[1];

  var onChange = function onChange(e) {
    var userQuery = Object.assign({}, userQueryObj);
    userQuery.queryParams.QueryString = e.currentTarget.value;
    getUserSuggesstions(userQuery).then(function (data) {
      if (data && data.d.ClientPeoplePickerSearchUser && data.d.ClientPeoplePickerSearchUser.length > 0) {
        var jsonData = JSON.parse(data.d.ClientPeoplePickerSearchUser);
        jsonData = jsonData.map(function (item) {
          if (item.EntityData.Email) return item;else {
            var strSpilt = item.Key.split("|");
            item.EntityData.Email = strSpilt[2];
            return item;
          }
        });
        setActiveSuggestion("");
        setFilteredSuggestions(jsonData);
        setShowSuggestions(true);
      }
    })["catch"](function (err) {
      console.log(err);
    });
    setUserInput(e.currentTarget.value);
    props.getSelectedUser(null);
  };

  var onClick = function onClick(e) {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.DisplayText);
    props.getSelectedUser(e);
  };

  var onKeyDown = function onKeyDown(e) {
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion].DisplayText);
      props.getSelectedUser(filteredSuggestions[activeSuggestion]);
    } else if (e.keyCode === 38) {
        if (activeSuggestion === 0) {
          return;
        }

        if (activeSuggestion === "") {
          setActiveSuggestion(0);
        } else {
          setActiveSuggestion(activeSuggestion - 1);
        }
      } else if (e.keyCode === 40) {
          if (activeSuggestion === filteredSuggestions.length - 1) {
            return;
          }

          if (activeSuggestion === "") {
            setActiveSuggestion(0);
          } else {
            setActiveSuggestion(activeSuggestion + 1);
          }
        }
  };

  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles.request
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative-position"
  }, /*#__PURE__*/React.createElement("input", {
    className: "search",
    type: "text",
    placeholder: "Start typing...",
    onChange: onChange,
    onKeyDown: onKeyDown,
    value: userInput
  }), /*#__PURE__*/React.createElement("span", {
    className: "request-search-icon"
  })), showSuggestions && userInput ? filteredSuggestions.length > 0 ? /*#__PURE__*/React.createElement(SuggestionListComponent, {
    activeSuggestion: activeSuggestion,
    filteredSuggestions: filteredSuggestions,
    handleParentClick: onClick
  }) : userInput.length > 3 ? /*#__PURE__*/React.createElement("div", {
    "class": "no-suggestions"
  }, /*#__PURE__*/React.createElement("em", null, "No maching user found!")) : /*#__PURE__*/React.createElement(Fragment, null) : /*#__PURE__*/React.createElement(Fragment, null)));
};

var SuggestionListComponent = function SuggestionListComponent(props) {
  var handleClick = function handleClick(e) {
    props.handleParentClick(e);
  };

  return /*#__PURE__*/React.createElement("ul", {
    className: "suggestions"
  }, props.filteredSuggestions.map(function (suggestion, index) {
    return /*#__PURE__*/React.createElement("li", {
      onClick: function onClick(e) {
        handleClick(suggestion);
      }
    }, "" + suggestion.DisplayText);
  }));
};

export default SpPeoplePicker;
//# sourceMappingURL=index.modern.js.map
