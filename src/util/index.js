import hyperstyles from 'hyperstyles';
import { h } from 'mercury';

const hyper = hyperstyles(h);

function createPropsChannel(propNames) {
  if (typeof propNames === 'string') {
    propNames = [propNames];
  }

  return setProps.bind(null, propNames);
}

function setProps(propNames, state, data) {
  if (!propNames) {
    propNames = Object.keys[data];
  }

  propNames.forEach(function(propName) {
    setProp(state[propName], data[propName]);
  });
}

function setProp(prop, value) {
  if (typeof prop !== 'function' || !('set' in prop)) {
    return;
  }

  if (typeof prop() === 'number' && +value == value) {
    prop.set(+value);
  } else {
    prop.set(value);
  }
}

function pluralise(word, count) {
  return count === 1 ? word : word + 's';
}

export { hyper, createPropsChannel, pluralise };
