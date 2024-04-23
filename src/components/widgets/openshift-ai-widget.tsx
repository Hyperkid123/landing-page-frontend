import React, { useEffect } from 'react';
import { SimpleServiceWidget } from './simple-service-widget';
import {
  buildDataObject,
  createResizeObserverBreakpoint,
} from '../../utils/resizeObseverPOC';

import './openshift-ai-widget.scss';

// const useBreakpoints = (ref, variant = 'sm') => {
//   .....
// }

const OpenShiftAiWidget: React.FunctionComponent = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hasRef, setHasRef] = React.useState(false);
  // const ref = useBreakpoints('sm');
  useEffect(() => {
    let observer: ResizeObserver;
    console.log({ rc: ref.current });
    if (ref.current && !hasRef) {
      buildDataObject(ref.current);
      observer = createResizeObserverBreakpoint();
      observer.observe(ref.current);
      setHasRef(true);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  return (
    // data-size-width-*
    <div
      ref={ref}
      // data-size-width-300em="yellow"
      // data-size-height-sm=""
      data-size-sm="width: 300; className: pf-m-sm;"
    >
      <SimpleServiceWidget
        id={6}
        body="Create, train, and serve artificial intelligence and machine learning (AI/ML) models."
        linkTitle="OpenShift AI HAHAH"
        url="/application-services/data-science"
      />
    </div>
  );
};

export default OpenShiftAiWidget;
