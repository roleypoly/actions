# actions

collections of github actions

## file structure

_this is a little non-standard, so hear it out:_

An action lives in 3 places,

- `action-name/action.yml` - the base action definition
- `src/action-name/*.ts` - typescript version of the code
- `lib/action-name/*.js` - compiled javascript version of the code
