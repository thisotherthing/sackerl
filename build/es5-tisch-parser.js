"use strict";

var extraDataPostfix = "__DATA";
var addHeader = function (result, line) {
  var splitHeaderLine = line.split(":").map(function (headerLinePart) { return headerLinePart.trim(); });
  var isENum = splitHeaderLine[1].match(/^{.+}$/) !== null;
  if (isENum) {
    result.header.push({
      name: splitHeaderLine[0],
      type: splitHeaderLine[1].replace(/[{}]/g, "").split(",").map(function (tag) { return tag.trim(); }),
    });
  }
  else {
    var hasExtraData = splitHeaderLine[1].endsWith("__WITH_DATA");
    var type = splitHeaderLine[1].replace("__WITH_DATA", "");
    result.header.push({ name: splitHeaderLine[0], type: type });
    if (hasExtraData) {
      result.header.push({ name: "" + splitHeaderLine[0] + extraDataPostfix, type: type });
    }
  }
};
var addEntryData = function (result, entry, data) {
  var dataIndex = Object.keys(entry).length;
  var dataName = result.header[dataIndex].name;
  var dataType = result.header[dataIndex].type;
  var extraDataName = "" + result.header[dataIndex].name + extraDataPostfix;
  var hasExtraData = result.header.filter(function (v) { return v.name === extraDataName; }).length > 0;
  if (hasExtraData) {
    var splitData_1 = data.split("__");
    entry[dataName] = splitData_1.shift();
    entry[extraDataName] = splitData_1.join("__") || null;
  }
  else {
    entry[dataName] = data;
  }
  var splitData = entry[dataName];
  if (Array.isArray(dataType) && !dataType.includes(splitData)) {
    entry[dataName] = "INVALID TYPE " + entry[dataName];
  }
  else if (dataType === "NUMBER") {
    entry[dataName] = parseFloat(splitData);
  }
  else if (dataType === "DATE") {
    entry[dataName] = new Date(splitData);
  }
  else if (dataType === "BOOL") {
    entry[dataName] = splitData.toLowerCase() === "true";
  }
};
function parse(data) {
  var parsingEntries = false;
  var newEntry = {};
  var result = {
    header: [],
    data: [],
  };
  data.split("\n").forEach(function (line) {
    var trimmedLine = line.trim();
    var emptyLine = trimmedLine.length === 0;
    if (!emptyLine) {
      parsingEntries = parsingEntries || !trimmedLine.includes(":");
      if (parsingEntries) {
        addEntryData(result, newEntry, trimmedLine);
      }
      else {
        addHeader(result, trimmedLine);
      }
    }
    if (emptyLine && Object.keys(newEntry).length > 0) {
      Object.keys(newEntry).filter(function (key) { return newEntry[key] === null; }).forEach(function (key) { return delete newEntry[key]; });
      result.data.push(newEntry);
      newEntry = {};
    }
  });
  return result;
}

