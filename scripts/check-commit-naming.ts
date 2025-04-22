// import { fetch, setGlobalDispatcher, ProxyAgent } from 'undici'
// setGlobalDispatcher(new ProxyAgent('http://127.0.0.1:8080'));
import { spawnSync } from 'node:child_process';

const { GITHUB_API_URL, GITHUB_REPOSITORY, GITHUB_TOKEN, GITHUB_HEAD_REF } =
  process.env;

const dir = process.cwd();

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

  const allJobsResponse = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/commits/${GITHUB_HEAD_REF}/check-runs`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  const allJobsResult = await allJobsResponse.json();

  const firstJob = allJobsResult.check_runs.reduce((item, v) => {
    return v;
  });

  const GITHUB_JOB_ID = firstJob.id;

  const url = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/check-runs/${GITHUB_JOB_ID}`;

  const response = await fetch(url, {
    body: JSON.stringify({
      completed_at: '2025-04-18T01:14:52Z',
      conclusion: 'success',
      name: 'mighty_readme',
      output: {
        annotations: [
          {
            annotation_level: 'warning',
            end_line: 2,
            message: "Check your spelling for '\''banaas'\''.",
            path: 'README.md',
            raw_details: "Do you mean '\''bananas'\'' or '\''banana'\''?",
            start_line: 2,
            title: 'Spell Checker',
          },
          {
            annotation_level: 'warning',
            end_line: 4,
            message: "Check your spelling for '\''aples'\''",
            path: 'README.md',
            raw_details: "Do you mean '\''apples'\'' or '\''Naples'\''",
            start_line: 4,
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
      started_at: '2018-05-04T01:14:52Z',
      status: 'completed',
    }),
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    method: 'PATCH',
  });

  const body = await response.json();

  console.log(body);
};

void run();
