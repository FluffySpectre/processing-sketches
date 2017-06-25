class Food extends SimObject {
  int amount;
  int maxAmount;
  
  Food(PVector position, PVector rotation, PVector scale, int amount) {
    super(position, rotation, scale);
    
    this.amount = amount;
    this.maxAmount = amount;
  }
  
  int pickup(int amount) {
    int pickAmount = Math.min(amount, this.amount);
    this.amount -= pickAmount;
    return pickAmount;
  }
  
  void render() {
    fill(250);
    ellipse(position.x, position.y, scale.x * ((float)amount / (float)maxAmount), scale.y * ((float)amount / (float)maxAmount));
  }
}  