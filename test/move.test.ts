import { WasmFs } from '@wasmer/wasmfs'
import { Git } from "../pkg/git";
import { Move } from "../pkg/move";

describe("Move", () => {
  let wasmfs:WasmFs;
  let git:Git;

  beforeEach(async () => {
    wasmfs = new WasmFs();
    git = new Git(wasmfs);
  });

  it("run build unit-test should be ok", async () => {
    await git.download("./base/test/data/unit-test.zip", "/workspace/unit-test");
 
    let cli = new Move(wasmfs, {
        pwd: "/workspace/unit-test"
    })

    await cli.run(["--address_maps", "Std:0x1", "--test", "true"])

    const unitTestExists = wasmfs.fs.existsSync("/workspace/unit-test/target/starcoin/release/package.blob")
    expect(unitTestExists).toBeTruthy()
  });
 
  it("run build starcoin-framework should be ok", async () => {
    await git.download("./base/test/data/starcoin-framework.zip", "/workspace/starcoin-framework");
 
    let cli = new Move(wasmfs, {
        pwd: "/workspace/starcoin-framework"
    })
    
    await cli.run(["--dependency_dirs", "/workspace/starcoin-framework/unit-test", "--address_maps", "StarcoinFramework:0x1,StarcoinAssociation:0xA550C18,VMReserved:0x0,Std:0x1"])

    const ntfExists = wasmfs.fs.existsSync("/workspace/starcoin-framework/target/starcoin/release/package.blob")
    expect(ntfExists).toBeTruthy()
  });
 

  it("run build my-counter example should be ok", async () => {
    await git.download("./base/test/data/starcoin-framework.zip", "/workspace/starcoin-framework");
    await git.download("./base/test/data/my-counter.zip", "/workspace/my-counter");
 
    let cli = new Move(wasmfs, {
        pwd: "/workspace/my-counter",
        preopens: ["/workspace"]
    })
    
    await cli.run(["--dependency_dirs", "/workspace/starcoin-framework,/workspace/starcoin-framework/unit-test", "--address_maps", "StarcoinFramework:0x1,MyCounter:0xABCDE,StarcoinAssociation:0xA550C18,VMReserved:0x0,Std:0x1"])

    const ntfExists = wasmfs.fs.existsSync("/workspace/my-counter/target/starcoin/release/package.blob")
    expect(ntfExists).toBeTruthy()
  });

});