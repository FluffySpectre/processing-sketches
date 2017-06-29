class Regulator {
  private float lastTimeActive;
  private float interval;
  
  Regulator(float interval) {
    this.interval = inzerval;
    this.lastTimeActive = millis();
  }
  
  // call this method in update in order to get a regulated ... 
  boolean isReady() {
    if (millis() > lastTimeActive + interval) {
      lastTimeActive = millis();
      return true;
    }
    return false;
  }
}