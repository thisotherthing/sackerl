# Sackerl
a plaintext database format

## Tisch
stores a list of elements

at the start of file the keys are defined along with their types
valid types are `TEXT`, `NUMBER`, `BOOL` and `{A, LIST, OF, VALUES}`
optional other data can be added by adding `__WITH_DATA` to the type and adding `__{whatever}` to the value

each data is seperated by an empty line
the values have to be in the order of the types, and if there are no more values, the keys afterward are treated as optional

at the end of the file should be an empty line

### Example
```
NAME : TEXT__WITH_DATA
KIND: {MOVIE, BOOK, SHOW, GAME, MUSIC, PODCAST}
DATE : DATE
RATING: {STOPPED, FINISHED, LIKED, AMAZING}
NUMBER_TEST: NUMBER
BOOL_TEST: BOOL
SINGLE_ENUM: {TEST}
NOTE: TEXT

Steven Universe Future__S01
SHOW
2019-12-27
AMAZING

The Leftovers
SHOW
2017-06-04
AMAZING
5
TRUE

```

### Output
```
{
  header: [
    {name: "NAME", type: "TEXT"},
    {name: "NAME__DATA", type: "TEXT"},
    {
      name: "KIND",
      type: [
        "MOVIE",
        "BOOK",
        "SHOW",
        "GAME",
        "MUSIC",
        "PODCAST",
      ],
    },
    {name: "DATE", type: "DATE"},
    {
      name: "RATING",
      type: [
        "STOPPED",
        "FINISHED",
        "LIKED",
        "AMAZING",
      ],
    },
    {name: "NUMBER_TEST", type: "NUMBER"},
    {name: "BOOL_TEST", type: "BOOL"},
    {name: "SINGLE_ENUM", type: ["TEST"]},
    {name: "NOTE", type: "TEXT"},
  ],
  data: [
    {
      NAME: "Steven Universe Future",
      NAME__DATA: "S01",
      KIND: "SHOW",
      DATE: "2019-12-27T00:00:00.000Z",
      RATING: "AMAZING",
    },
    {
      NAME: "The Leftovers",
      KIND: "SHOW",
      DATE: "2017-06-04T00:00:00.000Z",
      RATING: "AMAZING",
      NUMBER_TEST: 5,
      BOOL_TEST: true,
    },
  ],
}
```
