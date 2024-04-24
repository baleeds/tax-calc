export function importJson(): Promise<any | undefined> {
  return new Promise((resolve) => {
    const el = document.createElement("input") as HTMLInputElement;
    el.type = "file";

    el.addEventListener('change', async () => {
      if (el.files?.length) {
        console.log(el.files[0]);
        const text = await el.files[0].text();
        resolve(JSON.parse(text));
        el.remove();
      }
    });

    el.click();
  });
}
