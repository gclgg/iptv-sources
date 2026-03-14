import fs from 'fs';
import path from 'path';

import type { IChannelsResult } from './channels';

import { sites_matrix } from './utils';

// 仅支持 GitHub Action 进行镜像站测试，降低镜像站负载压力

const matrixGen = (
  m: string
) => `| HTTP Protocol | URL | Auto-update Frequence | Latest Updated | IDC | Provider |
| ------------- | --- | --------------------- | --- | --- | -------- |
${m}
`;

const requestMirrorSite = async (url: string): Promise<string> => {
  try {
    const res = await fetch(`${url}/channels.json`);
    if (/^[2]/.test(res.status.toString())) {
      const channles = JSON.parse(await res.text()) as IChannelsResult;
      return new Date(channles.updated_at).toString();
    }
    throw new Error(`Get Updated Failed: **${res.statusText}**`);
  } catch (err) {
    throw new Error(`Get Updated Failed: **${(err as Error).toString()}**`);
  }
};

const updateMatrix = async () => {
  const readme_p = path.resolve('m3u', 'README.md');

  const m = await Promise.allSettled(
    sites_matrix?.map(async (site) => {
      let test = '';
      try {
        test = await requestMirrorSite(site.url);
      } catch (err) {
        test = err instanceof Error ? err.message : String(err);
      }
      return `| ${site.protocol} | <${site.url}> | ${site.frequence} | ${test} | ${site.idc} | ${site.provider} |`;
    })
  );

  const back = matrixGen(
    m.map((mm) => (mm.status === 'fulfilled' ? mm.value : String(mm.reason))).join('\n')
  );

  const readme = fs.readFileSync(readme_p, 'utf8').toString();
  fs.writeFileSync(readme_p, readme.replace('<!-- matrix_here -->', back));
};

updateMatrix();
