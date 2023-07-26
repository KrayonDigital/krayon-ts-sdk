SCRIPT_DIR=$(dirname $(realpath ${BASH_SOURCE[0]}))
scwd=$(pwd)

cd $SCRIPT_DIR
yarn build

for dir in $SCRIPT_DIR/dist/*-sdk; do
  echo $dir
  cd $dir
  yarn pack
done

cd $scwd
