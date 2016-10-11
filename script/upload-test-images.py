import girder_client
import os
import sys


def main():
    # Use the API key to authenticate.
    key = os.environ.get("GIRDER_API_KEY")
    if key is None:
        print >>sys.stderr, "Environment variable GIRDER_API_KEY is blank. Cannot upload images."
        return 1

    gc = girder_client.GirderClient(host="data.kitware.com", scheme="https")
    gc.authenticate(apiKey=key)

    # Retrieve the target folder, which should be at ~/Public/Travis\ Candela
    user = gc.get("user/me")
    if user is None:
        print >>sys.stderr, "No user logged in; API key may be bad."
        return 1

    travis_build_number = os.environ.get("TRAVIS_BUILD_NUMBER")
    travis_job_number = os.environ.get("TRAVIS_JOB_NUMBER")

    folder = gc.loadOrCreateFolder("Public", user["_id"], "user")
    folder = gc.loadOrCreateFolder("Travis Candela", folder["_id"], "folder")
    folder = gc.loadOrCreateFolder(travis_build_number, folder["_id"], "folder")
    folder = gc.loadOrCreateFolder(travis_job_number, folder["_id"], "folder")

    # Upload the files specified on the command line, creating (or loading) a
    # folder for each.
    for imageFile in sys.argv[1:]:
        (dirname, filename) = os.path.split(imageFile)
        compName = dirname.split(os.path.sep)[-2]

        compFolder = gc.loadOrCreateFolder(compName, folder["_id"], "folder")
        size = os.stat(imageFile).st_size

        with open(imageFile, "rb") as fd:
            gc.uploadFile(
                parentId=compFolder["_id"], stream=fd, name=filename, size=size,
                parentType="folder")


if __name__ == "__main__":
    sys.exit(main())
