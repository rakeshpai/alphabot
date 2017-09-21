import { css } from 'glamor';

export const button = css({
  display: 'inline-block',
  marginTop: 5,
  background: 'none',
  border: '1px solid #aaa',
  color: '#eee',
  padding: '5px 15px',
  fontFamily: `'Courier New', sans-serif`,
  fontSize: '1em',
  cursor: 'pointer'
});

export const blinker = css.keyframes({ '50%': { opacity: 0 }});
