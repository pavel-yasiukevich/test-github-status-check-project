// import { fetch, setGlobalDispatcher, ProxyAgent } from 'undici'
// setGlobalDispatcher(new ProxyAgent('http://127.0.0.1:8080'));
import { spawnSync } from 'node:child_process';
import { sign } from 'jsonwebtoken';
import { createWriteStream, constants } from 'node:fs';

const {
  GITHUB_STEP_SUMMARY,
  GITHUB_API_URL,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  GITHUB_HEAD_REF,
  PRIVATE_KEY,
} =
  process.env;

const dir = process.cwd();

const iss = 'Iv23liv5rZjg3yTacx8x'

const node = (script: string) => {
  return spawnSync('node', [
    '--experimental-strip-types',
    '--experimental-transform-types',
    '--no-warnings=ExperimentalWarnings',
    script,
  ]);
};

const run = async () => {
  // const checkCommitLint = node(dir + '/check-commit-naming-commitlint.ts');
  // const checkCustom = node(dir + '/check-commit-naming-custom.ts');
  //
  // const stdout1 = JSON.parse(checkCommitLint.stdout.toString() || '[]');
  // const stdout2 = JSON.parse(checkCustom.stdout.toString() || '[]');

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 600;

  const jwtToken = sign({
    exp,
    iat,
    iss,
  }, PRIVATE_KEY, { algorithm: 'RS256' });


  const installationResponse = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/installation`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );

  const installationBody = await installationResponse.json();

  const { id }: any = installationBody;

  const accessTokenResponse: any =  await fetch(
    `${GITHUB_API_URL}/app/installations/${id}/access_tokens`,
  );

  const accessTokenBody = await accessTokenResponse.json();

  const { token }: any = accessTokenBody;

  const url = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/check-runs`;

  const response = await fetch(url, {
    body: JSON.stringify({
      completed_at: '2025-04-18T01:14:52Z',
      conclusion: 'success',
      name: 'mighty_readme',
      output: {
        annotations: [
          {
            annotation_level: 'warning',
            end_line: 1,
            message: "Check your spelling for '\''banaas'\''.",
            path: 'src/index.ts',
            raw_details: "Do you mean '\''bananas'\'' or '\''banana'\''?",
            start_line: 1,
            title: 'Spell Checker',
          },
        ],
        images: [
          { alt: 'Super bananas', image_url: 'http://example.com/images/42' },
        ],
        summary: 'There are 0 failures, 2 warnings, and 1 notices.',
        text: 'You may have some misspelled words on lines 2 and 4. You also may want to add a section in your README about how to install your app.',
        title: 'Mighty Readme report',
      },
      started_at: '2025-05-04T01:14:52Z',
      status: 'completed',
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    method: 'POST',
  });

  const body = await response.json();

  console.log(installationBody);
  console.log(accessTokenBody);
  console.log(body);
};

void run();

// process.stdout.write('::error file=src/index.ts,line=1,col=1,endColumn=7,title=ERRR::Message Error\n');
// process.stdout.write('::warning file=src/index.ts,line=1,col=1,endColumn=7,title=Warn::Message Warning\n');
//
// const stream = createWriteStream(GITHUB_STEP_SUMMARY, { mode: constants.O_APPEND, encoding: 'utf8' })
//
// stream.write('### Hello world! :rocket:');
//
// stream.end(() => {
//   process.exit(78);
// });
