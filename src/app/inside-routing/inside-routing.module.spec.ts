import { InsideRoutingModule } from './inside-routing.module';

describe('InsideRoutingModule', () => {
  let insideRoutingModule: InsideRoutingModule;

  beforeEach(() => {
    insideRoutingModule = new InsideRoutingModule();
  });

  it('should create an instance', () => {
    expect(insideRoutingModule).toBeTruthy();
  });
});
