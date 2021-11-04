import templates from './presets/templates';
import css from './presets/css';
import lint from './presets/lint';

export default function () {
  return [templates, css, lint];
}
