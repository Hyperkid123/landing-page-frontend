import React, { Fragment, useEffect, useRef } from 'react';
import { useFlag } from '@unleash/proxy-client-react';

import '../components/app-content-renderer/styles/panels.scss';

import FirstPanel from '../components/app-content-renderer/first-panel';
import SecondPanel from '../components/app-content-renderer/second-panel';
import { useLoadModule } from '@scalprum/react-core';

import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

// resize observer to manage classes
import {
  buildDataObject,
  createResizeObserverBreakpoint,
} from '../utils/resizeObseverPOC';

// conditional styling
import './observer-poc.scss';

const getWidgetLayoutLandingPage = () => {
  const scope = 'widgetLayout';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [{ default: WidgetLayout }] = useLoadModule(
    { scope, module: './WidgetLayout' },
    {}
  );
  if (!WidgetLayout) {
    return <></>;
  }
  return <WidgetLayout isLayoutLocked={false} layoutType={'landingPage'} />;
};

const Landing = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let observer: ResizeObserver;
    if (cardRef.current) {
      buildDataObject(cardRef.current);
      observer = createResizeObserverBreakpoint();
      observer.observe(cardRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  const { isBeta } = useChrome();
  const widgetLayoutLandingPageEnabled =
    (isBeta() && useFlag('platform.landing-page.widgetization')) ||
    (!isBeta() && useFlag('platform.landing-page.widgetization-stable'));
  return (
    <div
      ref={cardRef}
      data-size-sm="width: 600; className: red;"
      data-size-md="width: 1200; className: blue;"
      className="land-c-page-content pf-v5-u-display-flex pf-v5-u-flex-direction-column"
    >
      <Fragment>
        {widgetLayoutLandingPageEnabled ? null : <FirstPanel />}
        {widgetLayoutLandingPageEnabled ? null : <SecondPanel />}
        {widgetLayoutLandingPageEnabled ? getWidgetLayoutLandingPage() : null}
      </Fragment>
    </div>
  );
};

export default Landing;
