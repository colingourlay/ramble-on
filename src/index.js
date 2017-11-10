import debounce from 'debounce';
import document from 'global/document';
import { app } from 'mercury';
import App, { render } from './components/App';
import './index.css';

const model = App({
  text: localStorage.getItem('RambleOn_text'),
  counterName: localStorage.getItem('RambleOn_counterName'),
  decoratorName: localStorage.getItem('RambleOn_decoratorName'),
  timing: localStorage.getItem('RambleOn_timing')
});

model.text(
  debounce(text => {
    localStorage.setItem('RambleOn_text', text);
  }, 500)
);

model.counterName(counterName => {
  localStorage.setItem('RambleOn_counterName', counterName);
});

model.decoratorName(decoratorName => {
  localStorage.setItem('RambleOn_decoratorName', decoratorName);
});

model.timing(
  debounce(timing => {
    localStorage.setItem('RambleOn_timing', timing);
  })
);

app(document.body, model, render);
