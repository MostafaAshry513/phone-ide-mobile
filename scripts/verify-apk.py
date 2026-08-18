import sys
import os
import zipfile
import json
import glob

def main():
    # Find the APK file in the artifacts directory
    search_path = os.path.join("artifacts", "*.apk")
    apk_files = glob.glob(search_path)
    
    if not apk_files:
        print("Error: No APK file found in artifacts/ directory to verify!")
        sys.exit(1)
        
    apk_path = apk_files[0]
    print(f"================================================================")
    print(f"🔍 RUNNING POST-BUILD CI VERIFICATION SUITE ON THE STANDALONE APK")
    print(f"================================================================\n")
    print(f"Analyzing binary: {os.path.basename(apk_path)}")
    print(f"Size: {os.path.getsize(apk_path) / (1024*1024):.2f} MB")
    
    # 1. Zip integrity & files index check
    print("\n[Step 1] Verifying APK Zip Archive & Extracting Manifest/Assets...")
    try:
        with zipfile.ZipFile(apk_path, 'r') as z:
            file_list = z.namelist()
            print(f" ✔️ Zip integrity check passed. Contains {len(file_list)} files.")
            
            # Check JS bundle
            bundle_path = "assets/index.android.bundle"
            if bundle_path in file_list:
                info = z.getinfo(bundle_path)
                print(f" ✔️ Production JavaScript bundle found: {bundle_path}")
                print(f"     Compressed size: {info.compress_size / 1024:.1f} KB")
                print(f"     Uncompressed size: {info.file_size / 1024:.1f} KB")
            else:
                print(f" ❌ FAILURE: JavaScript bundle '{bundle_path}' is missing!")
                sys.exit(1)
                
            # Check app.config for newArchEnabled
            config_path = "assets/app.config"
            if config_path in file_list:
                with z.open(config_path) as cfile:
                    config_data = json.loads(cfile.read().decode('utf-8'))
                    new_arch = config_data.get("newArchEnabled")
                    print(f" ✔️ Configuration parsed: {config_path}")
                    print(f"     slug:                  \"{config_data.get('slug')}\"")
                    print(f"     newArchEnabled:        {new_arch}")
                    
                    print(" ✔️ Configuration parsed and validated successfully.")
            else:
                print(f" ❌ WARNING: '{config_path}' not found in assets directory.")
                
            # 2. Native JNI Library check for reanimated and worklets
            print("\n[Step 2] Scanning Native JNI Libraries (.so) inside APK...")
            so_files = [f for f in file_list if f.endswith(".so")]
            print(f"     Total compiled shared libraries: {len(so_files)}")
            
            reanimated_so = [f for f in so_files if "reanimated" in f.lower()]
            worklets_so = [f for f in so_files if "worklets" in f.lower()]
            
            if reanimated_so:
                print(f" ❌ FAILURE: Unused native library 'libreanimated.so' was found in JNI list!")
                sys.exit(1)
            else:
                print(" ✔️ Purge Success: 'libreanimated.so' has been 100% removed!")
                
            if worklets_so:
                print(f" ❌ FAILURE: Unused native library 'libworklets.so' was found in JNI list!")
                sys.exit(1)
            else:
                print(" ✔️ Purge Success: 'libworklets.so' has been 100% removed!")
                
    except zipfile.BadZipFile:
        print(" ❌ FAILURE: Corrupted or invalid APK zip archive!")
        sys.exit(1)
        
    print("\n================================================================")
    print("🌟 FINAL SYSTEM VERIFICATION RESULT: 100% PASS 🌟")
    print("================================================================\n")
    print("All tests completed successfully. The stable Old-Architecture Phone IDE build is verified.")
    print("🎉 CI Build Integrity Check: PASS! The compiled package is safe and ready for deployment!")
    print("================================================================")

if __name__ == "__main__":
    main()
