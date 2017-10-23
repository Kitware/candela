import random
import sys


def main():
    random.seed(0)

    print "normal,bimodal"

    for i in range(100):
        print "%f,%f" % (random.gauss(0, 1), random.gauss(0, 1) if i % 2 == 0 else random.gauss(30, 1))

    return 0


if __name__ == '__main__':
    sys.exit(main())
