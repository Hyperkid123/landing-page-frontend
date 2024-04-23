/* eslint-disable @typescript-eslint/ban-ts-comment */
import parse from 'style-to-object';

const modPrefix = 'pf-m-';

const keywordChecker = (string: string, testValue: string) => {
  const value = '^' + testValue;
  const regex = new RegExp(value);

  return regex.test(string);
};

const prependModifierPrefix = function (val: string) {
  return modPrefix + val.replace(' ', '');
};

const stripWhitespace = function (val: string) {
  return val.replaceAll(' ', '');
};

const size = '^size';
const on = '^on';
const keywords = [size, on];

function removeKeyword(data: string, array = keywords) {
  const prefix = new RegExp('^(' + array.join('|') + ')', 'g');
  data = data.replace(prefix, '').toLowerCase();

  return data;
}

function stringToArray(data = '') {
  const internalData = data.split(',');

  internalData.forEach((element, index) => {
    const val = prependModifierPrefix(element);
    internalData[index] = stripWhitespace(val);
  });

  return internalData;
}

type ObjectDataSet = {
  [key: string]: {
    containerSize?: string;
    classSet?: string[];
  };
} & {
  sizes?: string[];
};

export const buildDataObject = (
  ...entries: (HTMLElement & { objectDataset?: ObjectDataSet })[]
) => {
  for (const entry of entries) {
    const targetDataset = entry.dataset;
    const objectDataset: ObjectDataSet = {};
    const sizes: string[] = [];

    for (const key in targetDataset) {
      if (keywordChecker(key, 'size')) {
        const newKey = removeKeyword(key);
        const size = targetDataset[key];
        if (size) {
          objectDataset[newKey] = { containerSize: size };
          sizes.push(size);
        }
      }

      if (keywordChecker(key, 'on')) {
        const newKey = removeKeyword(key);
        const classes = targetDataset[key];
        const classSetArray = stringToArray(classes);
        objectDataset[newKey].classSet = classSetArray;
      }
    }

    objectDataset.sizes = sizes.reverse();

    entry.objectDataset = objectDataset;
  }
};

type Settings = {
  className: string;
  width?: string;
  height?: string;
};

function isSettings(settings: any): settings is Settings {
  if (typeof settings !== 'object' || settings === null) return false;
  return (
    settings.className !== undefined && (settings.width || settings.height)
  );
}

function isActiveSize(
  settings: Settings,
  currentWidth: number,
  currentHeight: number
) {
  try {
    if (settings.width && settings.height) {
      return (
        currentWidth >= parseInt(settings.width) &&
        currentHeight >= parseInt(settings.height)
      );
    }

    if (settings.width) {
      return currentWidth <= parseInt(settings.width);
    }

    if (settings.height) {
      return currentHeight <= parseInt(settings.height);
    }
  } catch (error) {
    console.error('Unable to parse container breakpoints: ', error);
  }

  return false;
}

function isElementWithDataset(
  element: unknown
): element is HTMLElement & { objectDataset: ObjectDataSet } {
  return (
    typeof element === 'object' &&
    element !== null &&
    'objectDataset' in element
  );
}

export const createResizeObserverBreakpoint = () =>
  new ResizeObserver((entries) => {
    for (const entry of entries) {
      const currentWidth = entry.target.getBoundingClientRect().width;
      const currentHeight = entry.target.getBoundingClientRect().height;
      let currentRules: Settings | undefined = undefined;
      if (!isElementWithDataset(entry.target)) {
        // exit if the element does not have the properties necessary
        return;
      }
      for (const size in entry.target.objectDataset) {
        const config = entry.target.objectDataset[size].containerSize;
        const settings = typeof config === 'string' ? parse(config) : undefined;
        if (isSettings(settings)) {
          if (
            isActiveSize(settings, currentWidth, currentHeight) &&
            !currentRules
          ) {
            currentRules = settings;
          }

          // reset classes
          entry.target.classList.remove(settings.className);
        }
      }

      if (currentRules) {
        const { className } = currentRules;
        entry.target.classList.add(className);
      }
    }
  });
