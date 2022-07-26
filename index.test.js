var sass = require('sass');

function render(data) {
  return new Promise(function(resolve, reject) {
    sass.render({ data, includePaths: ['./'] }, function(err, data) {
      if (err !== null) reject(err);
      else resolve(data.css.toString());
    });
  });
}

async function run(input, output, config = `@use "." as rpx;`) {
  const a = await render(config.concat(input));
  const b = await render(output);
  expect(a).toEqual(b);
};

it('Simple', () => run(
  '.simple { font-size: rpx.convert(24px); }',
  '.simple { font-size: 24rpx; }'
));

it('Multiple values', () => run(
  '.multiple { padding: rpx.convert(5px 10px); }',
  '.multiple { padding: 5rpx 10rpx; }'
));

it('Multiple mixed values', () => run(
  '.mixed { border-bottom: rpx.convert(1px solid black); }',
  '.mixed { border-bottom: 1rpx solid black; }'
));

it('Comma-separated values', () => run(
  '.comma { box-shadow: rpx.convert(0 0 2px #ccc, inset 0 0 5px #eee); }',
  '.comma { box-shadow: 0 0 2rpx #ccc, inset 0 0 5rpx #eee; }'
));

it('Alternate use', () => run(
  '.alternate { text-shadow: rpx.convert(1px 1px) #eee, rpx.convert(-1px) 0 #eee; }',
  '.alternate { text-shadow: 1rpx 1rpx #eee, -1rpx 0 #eee; }',
));

it('Multiple properties', () => run(
  '.multiple-properties { @include rpx.convert((font-size: 24px, margin: 10px 1.5rpx)); }',
  '.multiple-properties { font-size: 24rpx; margin: 10rpx 1.5rpx; }',
));

it('R Pixel fallback', () => run(
  '.fallback { @include rpx.convert(font-size, 24px); @include rpx.convert(margin, 10px 1.5rpx); }',
  '.fallback { font-size: 24px; font-size: 24rpx; margin: 10px 1.5px; margin: 10rpx 1.5rpx; }',
  '@use "." as rpx with ($fallback: true);',
));

it('R Pixel only', () => run(
  '.px-only { @include rpx.convert(font-size, 24px); @include rpx.convert(margin, 10px 1.5rpx); }',
  '.px-only { font-size: 24px; margin: 10px 1.5px; }',
  '@use "." as rpx with ($px-only: true);',
));

it('Changing baseline', () => run(
  '.baseline { font-size: rpx.convert(375px); }',
  '.baseline { font-size: 750rpx; }',
  '@use "." as rpx with ($baseline: 0.5px);',
));

it('Changing baseline + pixel fallback', () => run(
  'html { @include rpx.baseline; } .baseline-fallback { @include rpx.convert(font-size, 24px); }',
  'html { font-size: 62.5%; } .baseline-fallback { font-size: 24px; font-size: 2.4rpx; }',
  '@use "." as rpx with ($baseline: 10px, $fallback: true);',
));

it('Changing namespace', () => run(
  '.changing-namespace { font-size: to.rpx(24px); }',
  '.changing-namespace { font-size: 24rpx; }',
  '@use "." as to;',
));

it('Global namespace', () => run(
  '.global-namespace { font-size: rpx(24px); }',
  '.global-namespace { font-size: 24rpx; }',
  '@use "." as *;',
));

it('Legacy import', () => run(
  '.legacy-import { @include rpx(font-size, 24px); margin: rpx(10px 1.5rpx); }',
  '.legacy-import { font-size: 24px; font-size: 24rpx; margin: 10rpx 1.5rpx; }',
  '@import "."; $rpx-fallback: true;',
));
