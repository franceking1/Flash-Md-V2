export function createCopyCodeButton(code, number) {
  return {
    text: `📱 Pairing Code for ${number}`,
    footer: 'Click the button below to copy the code',
    buttons: [
      {
        buttonId: 'copy_code',
        buttonText: {
          displayText: '📋 Copy Code'
        },
        type: 1
      }
    ],
    headerType: 1
  };
}

export function createYesNoButtons(question) {
  return {
    text: question,
    buttons: [
      {
        buttonId: 'yes',
        buttonText: {
          displayText: '✅ Yes'
        },
        type: 1
      },
      {
        buttonId: 'no',
        buttonText: {
          displayText: '❌ No'
        },
        type: 1
      }
    ],
    headerType: 1
  };
}

export function createNumberPadButtons() {
  return {
    text: 'Select an option:',
    buttons: [
      {
        buttonId: '1',
        buttonText: {
          displayText: '1️⃣'
        },
        type: 1
      },
      {
        buttonId: '2',
        buttonText: {
          displayText: '2️⃣'
        },
        type: 1
      },
      {
        buttonId: '3',
        buttonText: {
          displayText: '3️⃣'
        },
        type: 1
      },
      {
        buttonId: '4',
        buttonText: {
          displayText: '4️⃣'
        },
        type: 1
      },
      {
        buttonId: '5',
        buttonText: {
          displayText: '5️⃣'
        },
        type: 1
      }
    ],
    headerType: 1
  };
}

