#!/bin/bash

cd /tmp

echo "Creating Musicbrainz database structure"

git clone https://github.com/metabrainz/postgresql-musicbrainz-unaccent.git && git clone https://github.com/metabrainz/postgresql-musicbrainz-collate.git
cd postgresql-musicbrainz-unaccent && make && make install && cd ../postgresql-musicbrainz-collate && make && make install && cd ../

# echo "localhost:5432:musicbrainz:$POSTGRES_USER:$POSTGRES_PASSWORD"  > ~/.pgpass
# chmod 0600 ~/.pgpass

psql -h localhost -d musicbrainz -U postgres -a -c "ALTER ROLE $POSTGRESQL_USERNAME SUPERUSER;"

psql -h localhost -d musicbrainz -U $POSTGRESQL_USERNAME -a -c "CREATE SCHEMA musicbrainz"

wget https://raw.githubusercontent.com/metabrainz/musicbrainz-server/master/admin/sql/Extensions.sql
psql -h localhost -d musicbrainz -U $POSTGRESQL_USERNAME -a -f Extensions.sql
rm Extensions.sql

wget https://raw.githubusercontent.com/metabrainz/musicbrainz-server/master/admin/sql/CreateTables.sql
psql -h localhost -d musicbrainz -U $POSTGRESQL_USERNAME -a -f CreateTables.sql
rm CreateTables.sql

echo "Downloading last Musicbrainz dump"
wget -nd -nH -P /tmp http://ftp.musicbrainz.org/pub/musicbrainz/data/fullexport/LATEST
LATEST="$(cat /tmp/LATEST)"
wget -nd -nH -P /tmp http://ftp.musicbrainz.org/pub/musicbrainz/data/fullexport/$LATEST/mbdump-derived.tar.bz2
wget -nd -nH -P /tmp http://ftp.musicbrainz.org/pub/musicbrainz/data/fullexport/$LATEST/mbdump.tar.bz2


echo "Uncompressing Musicbrainz dump"
tar xjf /tmp/mbdump-derived.tar.bz2
rm mbdump-derived.tar.bz2
tar xjf /tmp/mbdump.tar.bz2
rm mbdump.tar.bz2

for f in mbdump/*
do
 tablename="${f:7}"
 echo "Importing $tablename table"
 echo "psql -h localhost -d musicbrainz -U $POSTGRESQL_USERNAME -a -c COPY $tablename FROM '/tmp/$f'"
 chmod a+rX /tmp/$f
 psql -h localhost -d musicbrainz -U $POSTGRESQL_USERNAME -a -c "\COPY $tablename FROM '/tmp/$f'"
done

rm -rf mbdump

echo "Creating Indexes and Primary Keys"

wget https://raw.githubusercontent.com/metabrainz/musicbrainz-server/master/admin/sql/CreatePrimaryKeys.sql
psql -h localhost -d musicbrainz -U $POSTGRESQL_USERNAME -a -f CreatePrimaryKeys.sql
rm CreatePrimaryKeys.sql

wget https://raw.githubusercontent.com/metabrainz/musicbrainz-server/master/admin/sql/CreateIndexes.sql
psql -h localhost -d musicbrainz -U $POSTGRESQL_USERNAME -a -f CreateIndexes.sql
rm CreateIndexes.sql
