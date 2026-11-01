import { UnlockedRecord } from '../data/superpowers';

const STORAGE_KEY = 'boreas_unlocked_superpowers';
const STUDENT_NAME_KEY = 'boreas_saved_student_name';
const GOOGLE_FORM_URL_KEY = 'boreas_google_form_url';
const GOOGLE_FORM_ENTRIES_KEY = 'boreas_google_form_entries';

export interface GoogleFormConfig {
  formUrl: string; // e.g. https://docs.google.com/forms/d/e/.../viewform or formResponse
  nameEntryId: string; // e.g. entry.123456
  skillEntryId: string; // e.g. entry.234567
  storyEntryId: string; // e.g. entry.345678
}

export function getSavedStudentName(): string {
  try {
    return localStorage.getItem(STUDENT_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStudentName(name: string): void {
  try {
    localStorage.setItem(STUDENT_NAME_KEY, name);
  } catch (e) {
    console.error('Failed to save student name', e);
  }
}

export function getSavedRecords(): UnlockedRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load records from storage', e);
    return [];
  }
}

export function saveRecord(record: UnlockedRecord): void {
  try {
    const records = getSavedRecords();
    const existingIndex = records.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save record to storage', e);
  }
}

export const DEFAULT_GOOGLE_FORM_CONFIG: GoogleFormConfig = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfxJwrTSeU35wEUvi325Hn88owqYVYPau9W04RxDkG9A3H6XA/formResponse',
  nameEntryId: 'entry.2036506308',
  skillEntryId: 'entry.1318853835',
  storyEntryId: 'entry.2039571755'
};

// Google Form Storage & Helper
export function getGoogleFormConfig(): GoogleFormConfig {
  try {
    const savedUrl = localStorage.getItem(GOOGLE_FORM_URL_KEY);
    const rawEntries = localStorage.getItem(GOOGLE_FORM_ENTRIES_KEY);
    if (savedUrl && rawEntries) {
      return { formUrl: savedUrl, ...JSON.parse(rawEntries) };
    }
    // Return pre-configured form
    return DEFAULT_GOOGLE_FORM_CONFIG;
  } catch {
    return DEFAULT_GOOGLE_FORM_CONFIG;
  }
}

export function saveGoogleFormConfig(config: GoogleFormConfig): void {
  try {
    localStorage.setItem(GOOGLE_FORM_URL_KEY, config.formUrl.trim());
    localStorage.setItem(
      GOOGLE_FORM_ENTRIES_KEY,
      JSON.stringify({
        nameEntryId: config.nameEntryId.trim(),
        skillEntryId: config.skillEntryId.trim(),
        storyEntryId: config.storyEntryId.trim()
      })
    );
  } catch (e) {
    console.error('Failed to save Google Form config', e);
  }
}

/**
 * Automatically parses a Google Form prefilled link or form link to extract form action URL and entry IDs.
 * Example prefill link:
 * https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.1000000=A&entry.2000000=B&entry.3000000=C
 */
export function parsePrefilledGoogleFormUrl(url: string): Partial<GoogleFormConfig> | null {
  try {
    if (!url.includes('docs.google.com/forms')) return null;

    // Convert viewform -> formResponse
    let responseUrl = url.split('?')[0];
    if (responseUrl.endsWith('/viewform')) {
      responseUrl = responseUrl.replace('/viewform', '/formResponse');
    } else if (!responseUrl.endsWith('/formResponse')) {
      responseUrl = responseUrl.replace(/\/$/, '') + '/formResponse';
    }

    // Extract query params for entry.XXXX
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    const entryKeys: string[] = [];

    for (const [key] of params.entries()) {
      if (key.startsWith('entry.')) {
        entryKeys.push(key);
      }
    }

    return {
      formUrl: responseUrl,
      nameEntryId: entryKeys[0] || '',
      skillEntryId: entryKeys[1] || '',
      storyEntryId: entryKeys[2] || ''
    };
  } catch (err) {
    console.error('Failed to parse form URL', err);
    return null;
  }
}

/**
 * Submits the student result directly to Google Form!
 * Google Form requires fields:
 * 1. 姓名
 * 2. 超能力名稱
 * 3. 事件與感受
 */
export async function syncRecordToGoogleForm(
  record: UnlockedRecord,
  customConfig?: GoogleFormConfig
): Promise<{ success: boolean; message: string }> {
  const config = customConfig || getGoogleFormConfig();

  if (!config.formUrl) {
    return {
      success: false,
      message: '尚未設定 Google 表單網址。'
    };
  }

  // Ensure formResponse endpoint
  let formAction = config.formUrl;
  if (formAction.endsWith('/viewform')) {
    formAction = formAction.replace('/viewform', '/formResponse');
  } else if (!formAction.endsWith('/formResponse')) {
    formAction = formAction.replace(/\/$/, '') + '/formResponse';
  }

  try {
    const finalSkillName = record.customSkillName || record.skillName;
    const nameKey = config.nameEntryId || 'entry.2036506308';
    const skillKey = config.skillEntryId || 'entry.1318853835';
    const storyKey = config.storyEntryId || 'entry.2039571755';

    // 1. Fetch submission with no-cors
    const formData = new FormData();
    formData.append(nameKey, record.studentName);
    formData.append(skillKey, finalSkillName);
    formData.append(storyKey, record.story);

    try {
      fetch(formAction, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      }).catch((e) => console.log('fetch submit note:', e));
    } catch {
      // ignore
    }

    // 2. Hidden HTML Form submit in hidden iframe for 100% browser compatibility
    if (typeof document !== 'undefined') {
      let iframe = document.getElementById('google_form_submit_iframe') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'google_form_submit_iframe';
        iframe.name = 'google_form_submit_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.action = formAction;
      form.method = 'POST';
      form.target = 'google_form_submit_iframe';
      form.style.display = 'none';

      const inputName = document.createElement('input');
      inputName.type = 'hidden';
      inputName.name = nameKey;
      inputName.value = record.studentName;
      form.appendChild(inputName);

      const inputSkill = document.createElement('input');
      inputSkill.type = 'hidden';
      inputSkill.name = skillKey;
      inputSkill.value = finalSkillName;
      form.appendChild(inputSkill);

      const inputStory = document.createElement('input');
      inputStory.type = 'hidden';
      inputStory.name = storyKey;
      inputStory.value = record.story;
      form.appendChild(inputStory);

      // Support for other option if the question was set to multiple choice
      const otherOption = document.createElement('input');
      otherOption.type = 'hidden';
      otherOption.name = `${storyKey}.other_option_response`;
      otherOption.value = record.story;
      form.appendChild(otherOption);

      document.body.appendChild(form);
      form.submit();

      // Clean up after 2 seconds
      setTimeout(() => {
        try {
          document.body.removeChild(form);
        } catch {}
      }, 2000);
    }

    // Mark record as synced
    const updated = { ...record, syncedToCloud: true };
    saveRecord(updated);

    return {
      success: true,
      message: '已成功送出至 Google 表單！'
    };
  } catch (error) {
    console.error('Google Form submission failed', error);
    return {
      success: false,
      message: `表單送出異常: ${error instanceof Error ? error.message : '連線失敗'}`
    };
  }
}

/**
 * Export CSV matching the user's exact 3 columns:
 * 姓名,超能力名稱,事件與感受
 * plus timestamp and certificate ID for verification.
 */
export function exportRecordsToCSV(records: UnlockedRecord[]): void {
  if (records.length === 0) return;

  const headers = ['姓名', '超能力名稱', '事件與感受', '認證編號', '解鎖時間', '所屬系所'];

  const escapeCSV = (str: string = '') => {
    const text = String(str).replace(/"/g, '""');
    return `"${text}"`;
  };

  const rows = records.map((r) => [
    escapeCSV(r.studentName),
    escapeCSV(r.customSkillName || r.skillName),
    escapeCSV(r.story),
    escapeCSV(r.id),
    escapeCSV(r.unlockedAt),
    escapeCSV(r.category)
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Boreas_超能力解鎖結果_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
