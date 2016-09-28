import ses = require('../Session');
import dlg = require('./Dialog');
import logger = require('../logger');

export class StepResolver {

  private _getNext: (session: ses.Session, args: any) => void = null;

  constructor(next: (session: ses.Session, args: any) => void) {
    this._getNext = next;
  }
  getNext(session: ses.Session, args: any) {
    return this._getNext(session, args);
  }
}

export function walker(resolver: StepResolver | any): IDialogHandler<any> {
  return function walkerAction(s: ses.Session, r: dlg.IDialogResult<any>) {
    if (resolver && resolver instanceof StepResolver) {
      try {
        logger.info(s, 'resolver found');
        resolver.getNext(s, r);
      }
      catch (e) {
        s.error(e);
      }
    }
    else if (typeof resolver === 'function') {
      try {
        logger.info(s, 'resolver is a function');
        resolver(s, r);
      }
      catch (e) {
        s.error(e);
      }
    }
    else {
      logger.warn(s, 'resolver is not recognized or null');
      s.endDialogWithResult({ resumed: dlg.ResumeReason.notCompleted });
    }
  }
}