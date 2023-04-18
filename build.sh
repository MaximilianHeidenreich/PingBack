# FRONTEND
cd ./frontend
npm run build

# DOCS
cd ../docs
npm run build
rm -rf bundled
mv out bundled
cd ../