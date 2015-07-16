# YAML to XML or JSON Converter
=======================================================

Installation
------------

```
npm install -g yamltoxmljson
```

#### Usage

```
usage: yamltoxmljson ./config.json
```


### config.json example

``` json
{
	"supportedLocales": ["en", "de"],
	"dest": "path/to/dest/locales",
	"src": "path/to/src/locales",
	"type": "xml" // default would be json
}

```

### YAML file example
```yaml
---
en:
  secure: Secure
  amount: Amount
```

will write a JSON file like this:

`en.json`
``` json
{
  "secure": "Secure",
  "amount": "Amount"
}
```
