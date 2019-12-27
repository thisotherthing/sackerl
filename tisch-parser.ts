type DataEntry = {[key: string]: string | number | Date | boolean};

interface IResult {
  data: DataEntry[];
  header: {
    name: string;
    type: string | string[];
  }[];
}

const extraDataPostfix = "__DATA";

const addHeader = (
  result: IResult,
  line: string,
) => {
  const splitHeaderLine = line.split(":").map((headerLinePart) => headerLinePart.trim());
  const isENum = splitHeaderLine[1].match(/^{.+}$/) !== null;
  if (isENum) {
    result.header.push({
      name: splitHeaderLine[0],
      type: splitHeaderLine[1].replace(/[{}]/g, "").split(",").map((tag) => tag.trim()),
    });

  } else {
    const hasExtraData = splitHeaderLine[1].endsWith("__WITH_DATA");
    const type = splitHeaderLine[1].replace("__WITH_DATA", "");
    result.header.push({name: splitHeaderLine[0], type});
    if (hasExtraData) {
      result.header.push({name: `${splitHeaderLine[0]}${extraDataPostfix}`, type});
    }
  }
};

const addEntryData = (
  result: IResult,
  entry: DataEntry,
  data: string,
) => {
  const dataIndex = Object.keys(entry).length;
  const dataName = result.header[dataIndex].name;
  const dataType = result.header[dataIndex].type;
  const extraDataName = `${result.header[dataIndex].name}${extraDataPostfix}`;
  const hasExtraData = result.header.filter((v) => v.name === extraDataName).length > 0;

  if (hasExtraData) {
    const splitData = data.split("__");
    entry[dataName] = splitData.shift();

    entry[extraDataName] = splitData.join("__") || null;
  } else {
    entry[dataName] = data;
  }

  const splitData = entry[dataName] as string;

  if (Array.isArray(dataType) && !dataType.includes(splitData)) {
    entry[dataName] = `INVALID TYPE ${entry[dataName]}`;
  } else if (dataType === "NUMBER") {
    entry[dataName] = parseFloat(splitData);
  } else if (dataType === "DATE") {
    entry[dataName] = new Date(splitData);
  } else if (dataType === "BOOL") {
    entry[dataName] = splitData.toLowerCase() === "true";
  }
};

export function parse(
  data: string
): IResult {
  let parsingEntries: boolean = false;
  let newEntry: DataEntry = {};

  const result: IResult = {
    header: [],
    data: [],
  };

  data.split("\n").forEach((line: string) => {
    const trimmedLine = line.trim();
    const emptyLine = trimmedLine.length === 0;

    if (!emptyLine) {
      parsingEntries = parsingEntries || !trimmedLine.includes(":");

      if (parsingEntries) {
        addEntryData(result, newEntry, trimmedLine);
      } else {
        addHeader(result, trimmedLine);
      }
    }

    if (emptyLine && Object.keys(newEntry).length > 0) {
      Object.keys(newEntry).filter((key) => newEntry[key] === null).forEach((key) => delete newEntry[key]);
      result.data.push(newEntry);
      newEntry = {};
    }
  });

  return result;
}