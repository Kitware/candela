import girder_client
import os
import sys


def main():
    # Use the API key to authenticate.
    key = os.environ.get("GIRDER_API_KEY")
    if key is None:
        print >>sys.stderr, "Environment variable GIRDER_API_KEY is blank. Cannot upload images."
        return 1

    gc = girder_client.GirderClient(host="data.kitware.com", port=443, scheme="https")
    gc.authenticate(apiKey=key)

    # Retrieve the target folder, which should be at ~/Public/Travis\ Candela
    user = gc.get("user/me")
    if user is None:
        print >>sys.stderr, "No user logged in; API key may be bad."
        return 1

    travis_build_number = os.environ.get("TRAVIS_BUILD_NUMBER")
    travis_job_number = os.environ.get("TRAVIS_JOB_NUMBER")

    folder = gc.load_or_create_folder("Public", user["_id"], "user")
    folder = gc.load_or_create_folder("Travis Candela", folder["_id"], "folder")
    folder = gc.load_or_create_folder(travis_build_number, folder["_id"], "folder")
    folder = gc.load_or_create_folder(travis_job_number, folder["_id"], "folder")

    # Upload the files specified on the command line, creating (or loading) a
    # folder for each.
    for imageFile in sys.argv[1:]:
        (dirname, filename) = os.path.split(imageFile)
        compName = dirname.split(os.path.sep)[-2]

        compFolder = gc.load_or_create_folder(compName, folder["_id"], "folder")

        gc._upload_as_item(filename, compFolder["_id"], imageFile)


if __name__ == "__main__":
    sys.exit(main())
