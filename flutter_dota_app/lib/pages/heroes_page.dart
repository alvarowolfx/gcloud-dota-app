import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';

import 'package:dota_app/model/hero.dart';
import 'package:dota_app/components/hero_tile.dart';
import 'package:dota_app/pages/hero_page.dart';

class HeroesPage extends StatefulWidget {
  HeroesPage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _HeroesPageState createState() => _HeroesPageState();
}

class _HeroesPageState extends State<HeroesPage> {
  DatabaseReference heroesRef;
  String sortingMethod = 'name';

  @override
  void initState() {
    super.initState();
    heroesRef = FirebaseDatabase.instance.reference().child('/heroes');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: <Widget>[
          PopupMenuButton(
            icon: sortingMethod == 'name'
                ? Icon(Icons.sort_by_alpha)
                : Icon(Icons.sort),
            onSelected: (sortMethod) {
              setState(() {
                sortingMethod = sortMethod;
              });
            },
            itemBuilder: (BuildContext context) {
              return ['name', 'rank'].map((sortMethod) {
                return PopupMenuItem(
                    value: sortMethod, child: Text('Sort by $sortMethod'));
              }).toList();
            },
          ),
        ],
      ),
      body: Center(
        child: StreamBuilder<Event>(
          stream: this.heroesRef.onValue,
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return Center(child: CircularProgressIndicator());
            }

            Map<String, dynamic> heroesMap =
                Map.from(snapshot.data.snapshot.value);

            var heroes = heroesMap.keys.map((key) {
              return DotaHero.fromMap(Map.from(heroesMap[key]));
            }).toList();

            if (sortingMethod == 'rank') {
              heroes.sort((a, b) => a.rank - b.rank);
            } else {
              heroes.sort((a, b) => a.name.compareTo(b.name));
            }

            return GridView.builder(
              padding: EdgeInsets.all(8),
              shrinkWrap: true,
              itemCount: heroes.length,
              itemBuilder: (context, index) {
                return HeroTile(
                  heroes[index],
                  onHeroSelected: (hero) {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => HeroPage(hero: hero),
                      ),
                    );
                  },
                );
              },
              gridDelegate: new SliverGridDelegateWithFixedCrossAxisCount(
                childAspectRatio: 2,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
                crossAxisCount: 2,
              ),
            );
          },
        ),
      ),
    );
  }
}
